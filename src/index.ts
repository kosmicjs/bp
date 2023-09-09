import http from 'node:http';
import process from 'node:process';
import path from 'node:path';
import type {Server} from 'node:http';
import bodyParser from 'koa-bodyparser';
import responseTime from 'koa-response-time';
import type {HttpTerminator} from 'http-terminator';
import {createHttpTerminator} from 'http-terminator';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';
import serve from 'koa-static';
import createRouter from '@kosmic/fs-router';
import Koa from 'koa';
import errorHandler from './error-handler';
import {defaultLogger} from './types';
import type {Options, Logger} from './types';

export {
  type Next,
  type Middleware,
  type Context,
  type KoaRequest,
  type KoaResponse,
} from 'koa';

export class Core extends Koa {
  public static bodyParser = bodyParser;
  public static static = serve;
  public options: Options;
  public server: Server;
  public terminator?: HttpTerminator;
  public logger: Logger;
  public routesDir: string;
  constructor(options?: Options) {
    super({});
    this.options = options ?? {};
    this.server = http.createServer(this.callback());
    this.close = this.close.bind(this);
    this.terminator = undefined;
    this.logger = options?.logger ?? defaultLogger;
    this.routesDir = options?.routesDir ?? path.join(process.cwd(), 'api');

    // Middleware
    if (this.options.etag) {
      this.use(conditional());
      this.use(etag());
    }

    this.use(responseTime());
    this.use(errorHandler(this.logger));

    this.use(bodyParser());
    this.use(async (ctx, next) => {
      const data = ctx.request.body;
      ctx.body = {data};
    });
  }

  async start(arg1?: any, arg2?: any, arg3?: any): Promise<Server> {
    const server = this.server;

    this.use(createRouter(this.routesDir));

    return new Promise((resolve, reject) => {
      server
        .listen(...arguments)
        .once('listening', () => {
          this.terminator = createHttpTerminator({server: this.server});

          resolve(server);
        })
        .once('error', reject);
    });
  }

  async close(): Promise<void> {
    const server = this.server;
    if (this.terminator) {
      await this.terminator.terminate();
    }
  }
}
