import process from 'node:process';
import {pinoHttp, type Options} from 'pino-http';
import {type DestinationStream} from 'pino';
import {type Middleware} from 'koa';
import shortUUID, {type SUUID} from 'short-uuid';

const XRID_HEADER = 'x-request-id';

export function createPinoMiddleware(
  options: Options,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stream?: DestinationStream,
): Middleware {
  let id: SUUID | number = 0;
  options.genReqId ??= function (request, response) {
    const existingId = request.id ?? request.headers[XRID_HEADER];
    if (existingId) return existingId;

    if (process.env.NODE_ENV !== 'production' && typeof id === 'number') {
      id++;
    } else {
      const uid = shortUUID();
      id = uid.generate();
    }

    response.setHeader(XRID_HEADER, id);
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
