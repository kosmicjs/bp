import {type Middleware} from 'koa';

export const get: Middleware = async (ctx, next) => {
  await ctx.render('users', {id: ctx.params?.id});
};
