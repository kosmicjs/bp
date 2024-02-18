import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {type AddressInfo} from 'node:net';
import {pino} from 'pino';
import {Server} from 'socket.io';
import * as vite from 'vite';
import {ViteNodeServer} from 'vite-node/server';
import {ViteNodeRunner} from 'vite-node/client';
import {installSourcemapsSupport} from 'vite-node/source-map';

let isExiting = false;

const viteAbortController = new AbortController();
const serverAbortController = new AbortController();

/**
 * Dev tool logger
 */
const logger = pino({
  level: 'debug',
  transport: {target: 'pino-princess'},
  name: 'dev',
});

const exitHandler = () => {
  if (isExiting) return;
  logger.info('Exiting...');
  isExiting = true;
  serverAbortController.abort();
  viteAbortController.abort();
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

/**
 * server path after swc compilation
 */
const serverFilePath = path.join(cwd, 'src', 'index.ts');

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
        },
        optimizeDeps: {
          noDiscovery: true,
          include: [],
        },
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
      const node = new ViteNodeServer(viteNodeServer);

      // fixes stacktraces in Errors
      installSourcemapsSupport({
        getSourceMap: (source) => node.getSourceMap(source),
      });

      const runner = new ViteNodeRunner({
        debug: true,
        root: viteNodeServer.config.root,
        base: viteNodeServer.config.base,
        // when having the server and runner in a different context,
        // you will need to handle the communication between them
        // and pass to this function
        async fetchModule(id) {
          return node.fetchModule(id);
        },
        async resolveId(id, importer) {
          return node.resolveId(id, importer);
        },
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
  /**
   * Start the socket.io server
   */
  (async () => {
    const io: Server = new Server({
      cors: {
        origin: '*',
      },
    });
    io.on('connection', (socket) => {
      logger.debug(
        {'socket.id': socket.id},
        'socket connection established...',
      );
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

    return undefined;
  })(),
]);

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGQUIT', exitHandler);
process.on('SIGHUP', exitHandler);
process.on('exit', exitHandler);
