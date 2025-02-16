import process from 'node:process';
import {config} from './config/index.js';
import {logger} from './utils/logger.js';
import {createServer} from './server.js';

const server = await createServer();

server.listen({port: config.port, host: config.host});

process.on('unhandledRejection', async (error) => {
  throw error;
});

process.on('uncaughtException', async (error) => {
  logger.error(error);
  server.closeAllConnections();
  server.close();
});
