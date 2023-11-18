import {type Middleware} from 'koa';

declare module 'koa' {
  interface Context extends ExtendableContext {}
}

export const use: Middleware[] = [
  async (ctx, next) => {
    if (!ctx.isAuthenticated())
      throw new Error('Must be authenticated to view this information');
    await next();
  },
];

export const get: Middleware = async (ctx, next) => {
  await ctx.render('users', {id: ctx.params?.id});
};
