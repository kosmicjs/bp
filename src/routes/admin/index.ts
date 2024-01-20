import {type Middleware} from 'koa';

export const get: Middleware = async (ctx, next) => {
  if (!ctx.isAuthenticated()) {
    ctx.redirect('/');
    return;
  }

  await ctx.render('admin', {user: ctx.state.user});
};

// export const post: Middleware = async (ctx, next) => {
// };

// export const put: Middleware = async (ctx, next) => {
// };

// export const del: Middleware = async (ctx, next) => {
// };
