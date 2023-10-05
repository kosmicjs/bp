import url from 'node:url';
import path from 'node:path';
import shortUUID from 'short-uuid';
import {pino} from 'pino';
import {createPinoMiddleware} from './pino-http/index.js';
import {Kosmic} from './core/index.js';
import {renderMiddleware} from './render/middleware.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const routesDir = path.join(__dirname, 'routes');

const logger = pino({
  transport: {target: 'pino-princess'},
});

const app = new Kosmic()
  .withFsRouter(routesDir)
  .injectLogger(logger)
  .injectHttpLoggingMiddleware(
    createPinoMiddleware({
      logger,
      genReqId(request, response) {
        const existingId = request.id ?? request.headers['x-request-id'];
        if (existingId) return existingId;
        const uid = shortUUID();
        const id = uid.generate();
        response.setHeader('X-Request-Id', id);
        return id;
      },
    }),
  );

app.use(renderMiddleware(path.join(__dirname, 'views')));

await app.start(3000);

app.logger.info('Server started on port 3000');
