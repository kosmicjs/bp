import url from 'node:url';
import path from 'node:path';
import {promisify} from 'node:util';
import helmet from 'helmet';
import {createPinoMiddleware} from '../packages/pino-http/index.js';
import {Kosmic} from '../packages/core/index.js';
import logger from './config/logger.js';
import {config} from './config/index.js';
import {query, SQL} from './db/pool.js';

await query(SQL`SELECT now()`);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const routesDir = path.join(__dirname, 'routes');

export const app = new Kosmic()
  .withFsRouter(routesDir)
  .injectLogger(logger)
  .withBodyParser({enableTypes: ['json', 'form', 'text']})
  .withErrorHandler()
  .withStaticFiles(path.join(__dirname, 'public'))
  .injectHttpLoggingMiddleware(createPinoMiddleware({logger}))
  .withSession();

app.use(async (ctx, next) => {
  const helmetPromise = promisify(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'upgrade-insecure-requests':
            config.kosmicEnv === 'development' ? null : [],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'http://localhost:5173',
          ],
          'connect-src': [
            "'self'",
            'http://127.0.0.1:2222',
            'ws://127.0.0.1:2222',
            'ws://localhost:5173',
          ],
        },
      },
    }),
  );
  await helmetPromise(ctx.req, ctx.res);
  await next();
});

export const getCtx = () => {
  const ctx = app.currentContext;
  if (!ctx) throw new Error('No context found');
  return ctx;
};
