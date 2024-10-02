import process from 'node:process';
import {pino} from 'pino';
import {config} from './index.js';

export const logger = pino({
  name: 'server',
  level: process.env.LOG_LEVEL ?? 'debug',
  ...(config.nodeEnv === 'production'
    ? {}
    : {transport: {target: 'pino-princess'}}),
});

export default logger;
