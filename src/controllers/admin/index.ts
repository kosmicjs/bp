import {type Middleware} from 'koa';

export const useGet: Middleware[] = [
  async (ctx, next) => {
    if (!ctx.isAuthenticated())
      throw new Error('Must be authenticated to view this information');
    await next();
  },
];

export const get: Middleware = async (ctx, next) => {
  await ctx.render('admin', {user: ctx.state.user});
};
