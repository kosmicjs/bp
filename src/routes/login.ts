import {type Next, type Context} from 'koa';
import {passport} from '../config/passport.js';

// TODO: fix this so it happens under the hood.
declare module 'koa' {
  interface Context extends ExtendableContext {}
}

export async function post(ctx: Context, next: Next) {
  await passport.authenticate('local', async (error, user, info, status) => {
    if (user) {
      await ctx.login(user);
      ctx.redirect('/admin');
    } else {
      ctx.status = 400;
      ctx.body = {status: 'error'};
    }
  })(ctx, next);
}
