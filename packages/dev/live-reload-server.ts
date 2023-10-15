// this is just to demo the concept of SSE, not intended for production usage.
import {fileURLToPath} from 'node:url';
import http from 'node:http';
import path from 'node:path';
import chokidar from 'chokidar';
import {Server} from 'socket.io';
import {pino} from 'pino';

const logger = pino({transport: {target: 'pino-princess'}});

const io = new Server({
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  logger.info('socket connected');
});

io.listen(2222);

logger.info('socket.io listening on port 2222');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const host = '127.0.0.1';
// const port = 1111;

const watchGlob = path.resolve(
  __dirname,
  `../../src/views/**/*.{js,jsx,ts,tsx}`,
);
const watcher = chokidar.watch(watchGlob).on('ready', () => {
  logger.info('chokidar ready', watchGlob);
});
const handleChange = async (file: string) => {
  logger.info('file change detected', file);
  io.emit('restart', {file});
};

watcher.on('change', handleChange);
