import {pinoHttp, type Options} from 'pino-http';
import {type DestinationStream} from 'pino';
import {type Middleware} from 'koa';

export function createPinoMiddleware(
  options: Options,
  stream?: DestinationStream,
): Middleware {
  const middleware = pinoHttp(...arguments);

  return async function (ctx, next) {
    middleware(ctx.req, ctx.res);
    // eslint-disable-next-line no-multi-assign
    ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;
    await next();
  };
}
