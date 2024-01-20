import {type Middleware} from 'koa';
import {type Props} from '../views/admin.jsx';

export const useGet: Middleware[] = [
  async (ctx, next) => {
    if (!ctx.isAuthenticated())
      throw new Error('Must be authenticated to view this information');
    await next();
  },
];

export const get: Middleware = async (ctx, next) => {
  if (!ctx.state.user)
    throw new Error('A validated user is required to view this page');

  await ctx.render<Props>('admin', {user: ctx.state.user});
};
