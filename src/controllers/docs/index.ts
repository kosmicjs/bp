import {type Middleware} from 'koa';

export const get: Middleware = async (ctx, next) => {
  await ctx.render('docs');
};
