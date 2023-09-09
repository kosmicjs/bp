import type {Context as _Context} from 'koa';

export type Context = _Context & Record<string, unknown>;

export type KoaOptions = {
  env?: string;
  keys?: string[];
  proxy?: boolean;
  subdomainOffset?: number;
  proxyIpHeader?: string;
  maxIpsCount?: number;
};
export type LoggerMethods =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export type Logger = Record<LoggerMethods, (...logs: any[]) => any>;

export type Options = {
  etag?: boolean;
  bodyParser?: boolean;
  static?: boolean;
  logger?: Logger;
  routesDir?: string;
} & KoaOptions;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const defaultLogger: Logger = {
  trace: noop,
  debug: noop,
  info: console.log,
  warn: console.warn,
  error: console.error,
  fatal: console.error,
};

export {default as Koa} from 'koa';
