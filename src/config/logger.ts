import process from 'node:process';
import {pino} from 'pino';
import {config} from './index.js';

const logger = pino({
  name: 'server',
  level: process.env.LOG_LEVEL ?? 'debug',
  ...(config.env === 'production'
    ? {}
    : {transport: {target: 'pino-princess'}}),
});

export default logger;
