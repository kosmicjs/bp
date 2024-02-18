import url from 'node:url';
import path from 'node:path';
import {createPinoMiddleware} from '../packages/pino-http/index.js';
import {Kosmic} from '../packages/core/index.js';
import logger from './config/logger.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const routesDir = path.join(__dirname, 'controllers');

export const app = new Kosmic()
  .withFsRouter(routesDir)
  .injectLogger(logger)
  .withBodyParser({enableTypes: ['json', 'form', 'text']})
  .withErrorHandler()
  .withStaticFiles(path.join(__dirname, 'public'))
  .injectHttpLoggingMiddleware(createPinoMiddleware({logger}))
  .withSession();

export const getCtx = () => {
  const ctx = app.currentContext;
  if (!ctx) throw new Error('No context found');
  return ctx;
};

import.meta.hot?.dispose(async () => {
  await app.close();
});
