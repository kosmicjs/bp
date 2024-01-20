import process from 'node:process';
import {pino} from 'pino';

const logger = pino({
  name: 'server',
  level: process.env.LOG_LEVEL ?? 'debug',
  transport: {target: 'pino-princess'},
});

export default logger;
