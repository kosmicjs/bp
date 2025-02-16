import process from 'node:process';
import {start, close} from './server.js';
import {config} from './config/index.js';
import {logger} from './config/logger.js';

await start({port: config.port, host: config.host});

process.on('uncaughtException', async (error) => {
  logger.error(error);
  await close();
});
