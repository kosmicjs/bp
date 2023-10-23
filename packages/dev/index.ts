import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {$, type Options as ExecaOptions} from 'execa';
import chokidar from 'chokidar';
import {pino} from 'pino';
import {Server} from 'socket.io';
import * as vite from 'vite';

let isExiting = false;

const viteAbortController = new AbortController();
const serverAbortController = new AbortController();

const exitHandler = () => {
  if (isExiting) return;
  logger.info('Exiting...');
  isExiting = true;
  serverAbortController.abort();
  viteAbortController.abort();
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.resolve(__dirname, '..', '..');
const logger = pino({transport: {target: 'pino-princess'}});
const execaOptions: ExecaOptions = {
  stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  env: {
    NODE_NO_WARNINGS: '1',
  },
};
const serverFilePath = path.resolve(__dirname, '..', '..', 'src', 'server.ts');
const viteServer = await vite.createServer({});

try {
  const io: Server = new Server({
    cors: {
      origin: '*',
    },
  });
  io.on('connection', (socket) => {
    logger.info({'socket.id': socket.id}, 'socket connection established...');
  });
  io.listen(2222);
  logger.info('socket.io listening on port 2222');

  let server: ReturnType<typeof $>;

  const watchGlob = [
    path.resolve(__dirname, `../../src/**/*.{js,jsx,ts,tsx}`),
    path.resolve(__dirname, `../**/*.{js,jsx,ts,tsx}`),
  ];

  const handleFileChanges = (file: string) => {
    try {
      logger.info('Change detected, restarting server...');
      server.kill();
      server = $(
        execaOptions,
      )`node --enable-source-maps  --loader ts-node/esm ${serverFilePath}`;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      server.once('message', (message) => {
        if (file.includes('/views')) {
          io.emit('restart', 'restart');
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  chokidar
    .watch(watchGlob, {ignoreInitial: true})
    .on('ready', () => {
      logger.info({watchGlob}, 'chokidar ready');
    })
    .on('change', handleFileChanges)
    .on('add', handleFileChanges);

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);
  process.on('SIGQUIT', exitHandler);
  process.on('SIGHUP', exitHandler);
  process.on('exit', exitHandler);

  server = $(
    execaOptions,
  )`node --enable-source-maps --loader ts-node/esm ${serverFilePath}`;

  console.log('viteServer', viteServer);
  await viteServer.listen();
  viteServer.printUrls();
} catch (error) {
  await viteServer?.close();
  console.error(error);
  exitHandler();
}
