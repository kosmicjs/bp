import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {$} from 'execa';
import chokidar from 'chokidar';
import {pino} from 'pino';

const logger = pino({transport: {target: 'pino-princess'}});

type CP = ReturnType<typeof $>;

let liveReloadServer: CP;
let server: CP;
let vite: CP;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.resolve(__dirname, '..', '..');

const watchGlob = [
  path.resolve(__dirname, `../../src/**/*.{js,jsx,ts,tsx}`),
  path.resolve(__dirname, `../**/*.{js,jsx,ts,tsx}`),
];

const liveReloadServerAC = new AbortController();
const viteAC = new AbortController();
const serverAC = new AbortController();

const watcher = chokidar
  .watch(watchGlob, {
    ignored: path.resolve(__dirname, `../../src/views/**/*.{js,jsx,ts,tsx}`),
  })
  .on('ready', () => {
    logger.info({watchGlob}, 'chokidar ready');
  })
  .on('change', async (file) => {
    try {
      logger.info('Restarting server...');
      server.kill();
      server = $({
        stdio: 'inherit',
        cwd,
        signal: serverAC.signal,
        env: {
          NODE_NO_WARNINGS: '1',
        },
      })`node --loader ts-node/esm/transpile-only ${path.join(
        'src',
        'server.ts',
      )}`;
    } catch (error) {
      console.error(error);
    }
  });

let isExiting = false;

const exitHandler = () => {
  if (isExiting) return;
  logger.info('Exiting...');
  isExiting = true;
  liveReloadServerAC.abort();
  serverAC.abort();
  viteAC.abort();
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
};

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGQUIT', exitHandler);
process.on('SIGHUP', exitHandler);
process.on('exit', exitHandler);

try {
  liveReloadServer = $({
    stdio: 'inherit',
    signal: liveReloadServerAC.signal,
    cwd: __dirname,
    env: {
      NODE_NO_WARNINGS: '1',
    },
  })`node --loader ts-node/esm/transpile-only ./live-reload-server.js`;

  server = $({
    stdio: 'inherit',
    cwd,
    signal: serverAC.signal,
    env: {
      NODE_NO_WARNINGS: '1',
    },
  })`node --loader ts-node/esm/transpile-only ${path.join('src', 'server.ts')}`;

  vite = $({
    stdio: 'inherit',
    cwd,
    signal: viteAC.signal,
    env: {
      NODE_NO_WARNINGS: '1',
    },
  })`vite`;
} catch {
  exitHandler();
}
