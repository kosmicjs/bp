import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {type AddressInfo} from 'node:net';
import {$} from 'execa';
import chokidar from 'chokidar';
import {pino} from 'pino';
import {Server} from 'socket.io';
import * as vite from 'vite';
import esbuild from 'esbuild';
import glob from 'fast-glob';

let isExiting = false;

const viteAbortController = new AbortController();
const serverAbortController = new AbortController();

/**
 * Dev tool logger
 */
const logger = pino({
  level: 'info',
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
 * .dev folder for swc compiled files
 */
const devFolder = path.resolve(__dirname, '..', '..', '.dev');
/**
 * server path after swc compilation
 */
const serverFilePath = path.join(devFolder, 'src', 'index.js');

const viteServer = await vite.createServer({});

try {
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

  const watchGlob = [
    path.resolve(__dirname, `../../src/**/*.{js,jsx,ts,tsx}`),
    path.resolve(__dirname, `../**/*.{js,jsx,ts,tsx}`),
  ];

  /**
   * Clean .dev folder
   */
  await fs.rm(path.resolve(__dirname, '..', '..', '.dev'), {
    force: true,
    recursive: true,
  });

  /**
   * initial build
   */
  const tsbuilder = await esbuild.context({
    entryPoints: await glob(watchGlob),
    outdir: devFolder,
    platform: 'node',
    minify: false,
    sourcemap: true,
    target: 'node18',
    format: 'esm',
    tsconfig: path.join(cwd, 'tsconfig.json'),
  });

  await tsbuilder.rebuild();

  const handleFileChanges = async (file: string) => {
    try {
      if (file.endsWith('package.json')) {
        await fs.rm(path.join(devFolder, 'package.json'), {
          force: true,
          recursive: true,
        });
        await fs.mkdir(devFolder, {recursive: true});
        await fs.copyFile(
          path.join(cwd, 'package.json'),
          path.join(devFolder, 'package.json'),
        );
      } else {
        logger.debug({file: '.' + file.replace(cwd, '')}, 'ts rebuilding');
        await tsbuilder.rebuild();
      }
    } catch (error) {
      console.error(error);
    }
  };

  await new Promise((resolve, reject) => {
    chokidar
      .watch(watchGlob, {ignoreInitial: true})
      .on('ready', () => {
        logger.debug({watchGlob}, 'chokidar ready');
        resolve(undefined);
      })
      .on('change', handleFileChanges)
      .on('add', handleFileChanges);
  });

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);
  process.on('SIGQUIT', exitHandler);
  process.on('SIGHUP', exitHandler);
  process.on('exit', exitHandler);

  logger.info('starting server');
  const server = $({
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    env: {
      NODE_NO_WARNINGS: '1',
    },
  })`node --enable-source-maps --import dynohot/register ${serverFilePath}`;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  server.on('message', (message) => {
    if (message === 'reload') {
      logger.debug('sending reload to socket.io');
      io.emit('restart', 'restart');
    }
  });

  await viteServer.listen();
  // viteServer.printUrls();
} catch (error) {
  await viteServer?.close();
  console.error(error);
  exitHandler();
}
