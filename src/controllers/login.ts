import {type Next, type Context} from 'koa';
import passport from 'koa-passport';

// TODO: fix this so it happens under the hood.
declare module 'koa' {
  interface Context extends ExtendableContext {}
}

export async function post(ctx: Context, next: Next) {
  return passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/',
  })(ctx, next);
}
