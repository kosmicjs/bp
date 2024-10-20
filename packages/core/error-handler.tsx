import type {Middleware, Next, Context} from 'koa';
import {err} from 'pino-std-serializers';
import type {Logger} from '../logger/logger.interface.js';

function errorHandler(logger: Logger): Middleware {
  async function middleware(ctx: Context, next: Next) {
    try {
      await next();
    } catch (error: unknown) {
      logger.error(error);
      ctx.status = ctx.status.toString().startsWith('4') ? ctx.status : 500;
      if (error instanceof Error) {
        await ctx.renderRaw(
          <div class="toast-body bg-dark">
            {JSON.stringify(err(error)).replaceAll('\\"', '"')}
          </div>,
        );
      } else {
        throw error;
      }
    }
  }

  return middleware;
}

export default errorHandler;
