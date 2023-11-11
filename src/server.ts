import process from 'node:process';
import url from 'node:url';
import path from 'node:path';
import {pino} from 'pino';
import {renderMiddleware as jsxRender} from '../packages/render/jsx.middleware.js';
import {createPinoMiddleware} from '../packages/pino-http/index.js';
import {Kosmic} from '../packages/core/index.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const routesDir = path.join(__dirname, 'routes');

const logger = pino({
  level: 'debug',
  transport: {target: 'pino-princess'},
  name: 'server',
});

export const app = new Kosmic()
  .withFsRouter(routesDir)
  .injectLogger(logger)
  .injectHttpLoggingMiddleware(createPinoMiddleware({logger}));

app.use(await jsxRender(path.join(__dirname, 'views')));

import.meta.hot?.dispose(async (data) => {
  await app.close();
});
