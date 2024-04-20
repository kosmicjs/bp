import http, {type Server} from 'node:http';
import {type ListenOptions} from 'node:net';
import fs from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import bodyParser from 'koa-bodyparser';
import responseTime from 'koa-response-time';
import {createHttpTerminator, type HttpTerminator} from 'http-terminator';
import session from 'koa-session';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';
import Koa, {
  type Middleware,
  type Options as KoaOptions,
  type Context,
} from 'koa';
import serve from 'koa-static';
import createFsRouter from '../fs-router/index.js';
import {type Logger} from '../logger/logger.interface.js';
import {ConsoleLogger} from '../logger/console-logger.js';
import errorHandler from './error-handler.js';

declare module 'koa' {
  interface Context {
    id: number | string;
    log: Logger;
  }

  interface Request {
    log: Logger;
  }

  interface Locals {
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

let requestId = 0;

export let getCtx: () => Context; // eslint-disable-line import/no-mutable-exports

function _getCtx(this: Kosmic) {
  const ctx = this.currentContext;

  if (!ctx) {
    throw new Error('No context found');
  }

  return ctx;
}

export class Kosmic extends Koa {
  public static bodyParser = bodyParser;
  public static static = serve;
  public server: Server;
  public terminator?: HttpTerminator;
  public logger: Logger;
  private routesDir?: string;

  private readonly startOptions: {
    withBodyParser: boolean;
    withEtag: boolean;
    withResponseTime: boolean;
    withErrorHandler: boolean;
    withFsRouter: boolean;
    withSession: boolean;
    withStaticFiles: boolean;
  };

  private _etagOptions?: {weak?: boolean};
  private _responseTimeOptions?: {hrtime?: boolean};
  private _bodyParserOptions?: bodyParser.Options;
  private _httpLoggingMiddleware: Middleware;
  private _sessionOpts?: session.Config;
  private _staticFilesOptions?: Parameters<typeof serve>;
  private readonly _customMiddleware: Middleware[] = [];

  constructor(koaOptions: KoaOptions = {}) {
    super({...koaOptions, asyncLocalStorage: true});

    getCtx = _getCtx.bind(this);

    this.startOptions = {
      withBodyParser: true,
      withEtag: true,
      withResponseTime: true,
      withSession: false,
      withErrorHandler: true,
      withFsRouter: false,
      withStaticFiles: false,
    };

    this.server = http.createServer(this.callback());
    this.close = this.close.bind(this);
    this.terminator = undefined;
    this.logger = new ConsoleLogger();
    this._httpLoggingMiddleware = async (ctx, next) => {
      ctx.id = requestId++;

      this.logger = new ConsoleLogger({prefix: `[${ctx.id}]`});

      // eslint-disable-next-line no-multi-assign
      ctx.log = ctx.request.log = ctx.response.log = this.logger;

      await next();

      // read the response time set by X-Response-Time middleware
      this.logger.info(
        ` ${ctx.method} ${ctx.originalUrl} - ${
          ctx.response.get('X-Response-Time') as string
        }`,
      );
    };

    // this._customMiddleware = [];
  }

  withBodyParser(_bodyParserOptions?: bodyParser.Options) {
    this.startOptions.withBodyParser = true;
    this._bodyParserOptions = _bodyParserOptions;
    return this;
  }

  withEtag(options?: {weak: boolean} | false) {
    if (options === false) {
      this.startOptions.withEtag = false;
    } else {
      this.startOptions.withEtag = true;
      this._etagOptions = options;
    }

    return this;
  }

  withResponseTime(options?: {hrtime?: boolean} | false) {
    if (options === false) {
      this.startOptions.withResponseTime = false;
    } else {
      this.startOptions.withResponseTime = true;
      this._responseTimeOptions = options;
    }

    return this;
  }

  withErrorHandler(options?: false) {
    this.startOptions.withErrorHandler = options ?? true;
    return this;
  }

  withFsRouter(routesDir: string) {
    this.startOptions.withFsRouter = true;
    this.routesDir = routesDir;
    return this;
  }

  withSession(sessionOptions?: session.Config) {
    this.startOptions.withSession = true;
    this._sessionOpts = sessionOptions;
    return this;
  }

  withStaticFiles(...args: Parameters<typeof serve>) {
    this.startOptions.withStaticFiles = true;
    this._staticFilesOptions = [...args];
    return this;
  }

  addMiddleware(middleware: Middleware) {
    this._customMiddleware?.push(middleware);
    return this;
  }

  /**
   * The default logger is console, but you can inject your own logger.
   *
   * @param logger a pino compatible logger
   * @returns this
   */
  injectLogger(logger: Logger) {
    this.logger = logger;
    return this;
  }

  injectHttpLoggingMiddleware(middleware: Middleware) {
    this._httpLoggingMiddleware = middleware;
    return this;
  }

  /**
   * Starts the cosmic server with the selected options,
   * resolves with the instance of Kosmic.
   *
   * @param portOrOptions
   * @param hostname
   * @returns {this} Kosmic instance
   */
  public async start(
    portOrOptions?: number | string | ListenOptions,
    hostname?: string,
  ): Promise<this> {
    const server = this.server;

    await this._applyMiddleware();

    return new Promise((resolve, reject) => {
      const _server =
        typeof portOrOptions === 'number'
          ? server.listen(portOrOptions, hostname)
          : server.listen(portOrOptions);

      _server
        .once('listening', () => {
          this.terminator = createHttpTerminator({server: this.server});

          const address = _server.address();

          if (typeof address === 'string') {
            this.logger.info(`server started at ${address}`);
          } else {
            const isIPv6 = address?.family === 'IPv6';
            const host = isIPv6 ? `[${address?.address}]` : address?.address;
            this.logger.info(
              `server started at http://${host}:${address?.port}`,
            );
          }

          resolve(this);
        })
        .once('error', reject);
    });
  }

  public async close(): Promise<void> {
    /**
     * Set a close event handler and return a promise
     */
    const serverClosedPromise = new Promise((resolve) => {
      this.server.on('close', () => {
        resolve(undefined);
      });
    });
    /**
     * Close HTTP server connections
     * and properly cleanup and destroy them
     * and then close the server (handled internally by http-terminator)
     */
    if (this.terminator) {
      await this.terminator.terminate();
    }

    /** ensure the server has completely closed before returning */
    await serverClosedPromise;
  }

  private async _applyMiddleware() {
    this.use(async (ctx, next) => {
      ctx.locals ??= {ctx};
      return next();
    });

    this.use(this._httpLoggingMiddleware);

    if (this.startOptions.withResponseTime) {
      this.logger.trace('using response time');
      this.use(responseTime(this._responseTimeOptions));
    }

    if (this.startOptions.withEtag) {
      this.logger.trace({options: this._etagOptions}, 'using etag');

      this.use(conditional());
      this.use(etag(this._etagOptions));
    }

    if (this.startOptions.withBodyParser) {
      this.logger.trace(
        {options: this._bodyParserOptions},
        'using body parser',
      );
      this.use(bodyParser(this._bodyParserOptions));
    }

    if (this.startOptions.withErrorHandler) {
      this.logger.trace('using error handler');
      this.use(errorHandler(this.logger));
    }

    if (this.startOptions.withSession) {
      this.logger.trace('using session');
      this.keys = ['hurr de heee'];
      if (this._sessionOpts) {
        this.use(session(this._sessionOpts, this));
      } else {
        this.use(session(this));
      }
    }

    if (this._customMiddleware?.length > 0) {
      this.logger.trace('using custom middleware');
      for (const middleware of this._customMiddleware) {
        this.use(middleware);
      }
    }

    if (this.startOptions.withStaticFiles && this._staticFilesOptions?.[0]) {
      this.logger.trace(
        {options: this._staticFilesOptions},
        'using static files',
      );
      this.use(serve(...this._staticFilesOptions));
      if (process.env.NODE_ENV !== 'development') {
        this.use(async (ctx, next) => {
          const manifest = JSON.parse(
            await fs.readFile(
              path.join(
                this._staticFilesOptions?.[0] ?? '',
                '.vite',
                'manifest.json',
              ),
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
          ctx.locals ??= {ctx};
          ctx.locals.manifest = manifest;
          await next();
        });
      }
    }

    if (this.startOptions.withFsRouter) {
      this.logger.trace({routesDir: this.routesDir}, 'using fs router');
      const {middleware: fsRouterMiddleware} = await createFsRouter(
        this.routesDir,
      );
      this.use(fsRouterMiddleware);
    }
  }
}
