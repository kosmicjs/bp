import process from 'node:process';
import url from 'node:url';
import path from 'node:path';
import {pino} from 'pino';
import {renderMiddleware as jsxRender} from '../packages/render/jsx.middleware.js';
import {createPinoMiddleware} from '#kosmic/pino-http';
import {Kosmic} from '#kosmic/core';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const routesDir = path.join(__dirname, 'routes');

const logger = pino({
  transport: {target: 'pino-princess'},
});

export const app = new Kosmic()
  .withFsRouter(routesDir)
  .injectLogger(logger)
  .injectHttpLoggingMiddleware(createPinoMiddleware({logger}));

app.use(await jsxRender(path.join(__dirname, 'views')));

await app.start(3000);
app.logger.info('Server started on port 3000');

if (typeof process?.send === 'function') {
  process.send('ready');
}
