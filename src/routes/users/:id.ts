import {type Middleware} from 'koa';

export const get: Middleware = async (ctx, next) => {
  ctx.log.info('GET /users/:id');
  ctx.body = {id: ctx.params?.id};
};
