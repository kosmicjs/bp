import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {type AddressInfo} from 'node:net';
import {pino} from 'pino';
import {Server} from 'socket.io';
import * as vite from 'vite';
import {ViteNodeServer} from 'vite-node/server';
import {ViteNodeRunner} from 'vite-node/client';
import {
  viteNodeHmrPlugin,
  createHotContext,
  handleMessage,
} from 'vite-node/hmr';
import {installSourcemapsSupport} from 'vite-node/source-map';

let isExiting = false;

const logger = pino({
  level: 'info',
  transport: {target: 'pino-princess'},
  name: 'devsvr',
});

const exitHandler = (err?: Error | undefined) => {
  if (err) {
    logger.error(err);
  }

  if (isExiting) return;
  logger.info('Exiting...');
  isExiting = true;
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
};

/**
 * Current directory of this file
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * CWD of the project
 */
const cwd = path.resolve(__dirname, '..', '..');

logger.debug(`starting dev server from cwd:${cwd}`);

const io: Server = new Server({
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
  logger.debug({'socket.id': socket.id}, 'socket connection established...');
});
io.listen(2222);

// @ts-expect-error private property
const address: AddressInfo = io.httpServer.address(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call

let host;
if (typeof address === 'string') {
  host = address;
} else {
  const isIPv6 = address?.family === 'IPv6';
  host = isIPv6 ? `[${address?.address}]` : address?.address;
}

logger.debug(`socket.io listening on http://${host}:${address?.port}`);

/**
 * server path after swc compilation
 */
const serverFilePath = path.join(cwd, 'src', 'index.ts');

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGQUIT', exitHandler);
process.on('SIGHUP', exitHandler);
process.on('exit', exitHandler);

await Promise.all([
  (async () => {
    /**
     * Start the vite server
     */
    try {
      const viteServer = await vite.createServer({
        server: {port: 5173},
      });
      await viteServer.listen();
      viteServer.printUrls();
    } catch (error) {
      logger.error(error);
    }
  })(),
  /**
   * Start the vite-node server
   */
  (async () => {
    try {
      const viteNodeServer = await vite.createServer({
        root: cwd,
        configFile: false,
        server: {
          port: 5174,
          hmr: true,
        },
        mode: 'development',
        optimizeDeps: {
          include: [
            path.join(cwd, 'src', 'controllers', '**', '*.ts'),
            path.join(cwd, 'src', 'controllers', '**', '*.tsx'),
          ],
        },
        plugins: [viteNodeHmrPlugin()],
        customLogger: {
          ...vite.createLogger(),
          info: logger.info.bind(logger),
          warn: logger.warn.bind(logger),
          error: logger.error.bind(logger),
        },
      });

      // this is need to initialize the plugins
      await viteNodeServer.pluginContainer.buildStart({});

      // create vite-node server
      const node = new ViteNodeServer(viteNodeServer, {
        transformMode: {
          ssr: [/.*/],
        },
      });

      // fixes stacktraces in Errors
      installSourcemapsSupport({
        getSourceMap: (source) => node.getSourceMap(source),
      });

      const runner = new ViteNodeRunner({
        debug: true,
        root: viteNodeServer.config.root,
        base: viteNodeServer.config.base,
        async fetchModule(id) {
          return node.fetchModule(id, 'ssr');
        },
        async resolveId(id, importer) {
          return node.resolveId(id, importer, 'ssr');
        },
        createHotContext(runner, url) {
          return createHotContext(
            runner,
            viteNodeServer.emitter,
            [serverFilePath],
            url,
          );
        },
      });

      viteNodeServer.emitter?.on('message', async (payload): Promise<void> => {
        try {
          await handleMessage(
            runner,
            viteNodeServer.emitter,
            [serverFilePath],
            payload,
          );
          io.emit('restart', 'restart');
        } catch (error) {
          logger.error(error);
        }
      });

      // execute the file
      await runner.executeFile(serverFilePath);

      // close the vite server
      // await viteNodeServer.close();
    } catch (error) {
      logger.error(error);
    }

    return undefined;
  })(),
]);
