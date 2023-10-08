import {type Next, type Context, type Middleware} from 'koa';

export const get: Middleware = async function (ctx, next) {
  ctx.log.info('GET /');
  await ctx.render('home', {});
};
