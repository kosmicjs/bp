import {type Next, type Context} from 'koa';
import passport from 'koa-passport';

export async function post(ctx: Context, next: Next) {
  return passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/',
    failureMessage: 'Invalid email or password',
    successMessage: 'Logged in',
  })(ctx, next);
}
