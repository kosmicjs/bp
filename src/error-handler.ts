import type {Middleware, Next, Context} from 'koa';
import type {Logger} from './types';

function errorHandler(logger: Logger): Middleware {
  async function middleware(ctx: Context, next: Next) {
    try {
      await next();
    } catch (error: unknown) {
      logger.error(error);
      if (error instanceof Error) {
        ctx.body = {message: error.message, stack: error.stack};
      } else {
        throw error;
      }
    }
  }

  return middleware;
}

export default errorHandler;
