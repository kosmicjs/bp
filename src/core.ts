import http, {type Server} from 'node:http';
import {type ListenOptions} from 'node:net';
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
import {createPinoMiddleware} from '#middleware/pino-http.js';
import errorHandler from '#middleware/error-handler.js';
import createFsRouter from '#middleware/router/index.js';
import logger from '#config/logger.js';
import {config} from '#config/index.js';

const __dirname = import.meta.dirname;

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

const app = new Koa({asyncLocalStorage: true});

// add x-response-time header
app.use(responseTime());

// serve static files from public dir
app.use(serve(path.join(__dirname, 'public')));

// add manifest to state for prod
if (process.env.NODE_ENV === 'production') {
  app.use(async (ctx, next) => {
    const manifest = JSON.parse(
      await fs.readFile(
        path.join(__dirname, 'public', '.vite', 'manifest.json'),
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

const routesDir = path.join(__dirname, 'routes');
const {middleware: fsRouterMiddleware} = await createFsRouter(routesDir);
app.use(fsRouterMiddleware);

const server: Server = http.createServer(app.callback());

export const start = async (
  portOrOptions?: number | string | ListenOptions,
  hostname?: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const _server =
      typeof portOrOptions === 'number'
        ? server.listen(portOrOptions, hostname)
        : server.listen(portOrOptions);

    _server
      .once('listening', () => {
        const address = _server.address();
        if (typeof address === 'string') {
          logger.info(`server started at ${address}`);
        } else {
          const isIPv6 = address?.family === 'IPv6';
          const host = isIPv6 ? `[${address?.address}]` : address?.address;
          logger.info(`server started at http://${host}:${address?.port}`);
        }

        resolve();
      })
      .once('error', reject);
  });
};

export const close = async (): Promise<void> => {
  const serverClosedPromise = new Promise((resolve) => {
    server.on('close', () => {
      resolve(undefined);
    });
  });

  server.closeAllConnections();
  server.close();

  await serverClosedPromise;
};
