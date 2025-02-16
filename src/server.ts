import http, {type Server} from 'node:http';
import fs from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import bodyParser from 'koa-bodyparser';
import responseTime from 'koa-response-time';
import session from 'koa-session';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';
import Koa from 'koa';
import serve from 'koa-static';
import {helmetMiddleware} from '#middleware/helmet.js';
import {createPinoMiddleware} from '#middleware/pino-http.js';
import {errorHandler} from '#middleware/error-handler.js';
import createFsRouter from '#middleware/router/index.js';
import logger from '#utils/logger.js';
import {config} from '#config/index.js';
import {passport} from '#middleware/passport.js';

type Logger = typeof logger;

declare module 'koa' {
  interface Context {
    id: number | string;
    log: Logger;
  }

  interface Request {
    log: Logger;
  }

  interface State {
    manifest?: Record<
      string,
      {
        css: string[];
        file: string;
        isEntry: boolean;
        src: string;
      }
    >;
  }

  interface Response {
    log: Logger;
  }
}

export const app = new Koa({asyncLocalStorage: true});

export async function createServer(): Promise<Server> {
  // add x-response-time header
  app.use(responseTime());

  // serve static files from public dir
  app.use(serve(path.join(import.meta.dirname, 'public')));

  // add manifest to state for prod
  if (process.env.NODE_ENV === 'production') {
    app.use(async (ctx, next) => {
      const manifest = JSON.parse(
        await fs.readFile(
          path.join(import.meta.dirname, 'public', '.vite', 'manifest.json'),
          'utf8',
        ),
      ) as Record<
        string,
        {
          css: string[];
          file: string;
          isEntry: boolean;
          src: string;
        }
      >;
      ctx.state.manifest = manifest;
      await next();
    });
  }

  // add pino logger
  app.use(createPinoMiddleware({logger}));

  // koa essentials
  app.use(conditional());
  app.use(etag());
  app.use(bodyParser());

  // error handler
  app.use(errorHandler());

  app.keys = config.sessionKeys;

  app.use(session(app));

  // add fs routes
  const routesDir = path.join(import.meta.dirname, 'routes');
  const {middleware: fsRouterMiddleware} = await createFsRouter(routesDir);
  app.use(fsRouterMiddleware);

  // security headers
  app.use(helmetMiddleware);

  // passport auth
  app.use(passport.initialize({userProperty: 'email'}));
  app.use(passport.session());

  const server: Server = http.createServer(app.callback());

  return server;
}

export const getCtx = () => {
  const ctx = app.currentContext;
  if (!ctx) throw new Error('No context found');
  return ctx;
};
