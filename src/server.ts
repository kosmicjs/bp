import process from 'node:process';
import url from 'node:url';
import path from 'node:path';
import {pino} from 'pino';
import session from 'koa-session';
import {renderMiddleware as jsxRender} from '../packages/render/jsx.middleware.js';
import {createPinoMiddleware} from '../packages/pino-http/index.js';
import {Kosmic} from '../packages/core/index.js';
import {passport} from './config/passport.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const routesDir = path.join(__dirname, 'controllers');

const logger = pino({
  level: 'trace',
  transport: {target: 'pino-princess'},
  name: 'server',
});

export const app = new Kosmic()
  .withFsRouter(routesDir)
  .injectLogger(logger)
  .withBodyParser({enableTypes: ['json', 'form', 'text']})
  .withErrorHandler()
  .injectHttpLoggingMiddleware(createPinoMiddleware({logger}))
  .withSession();

import.meta.hot?.dispose(async (data) => {
  await app.close();
});
