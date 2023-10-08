import {pinoHttp, type Options} from 'pino-http';
import {type DestinationStream} from 'pino';
import {type Middleware} from 'koa';
import shortUUID from 'short-uuid';

export function createPinoMiddleware(
  options: Options,
  stream?: DestinationStream,
): Middleware {
  options.genReqId ??= function (request, response) {
    const existingId = request.id ?? request.headers['x-request-id'];
    if (existingId) return existingId;
    const uid = shortUUID();
    const id = uid.generate();
    response.setHeader('X-Request-Id', id);
    return id;
  };

  const middleware = pinoHttp(...arguments);

  return async function (ctx, next) {
    middleware(ctx.req, ctx.res);
    // eslint-disable-next-line no-multi-assign
    ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;
    await next();
  };
}
