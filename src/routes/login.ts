import {type Next, type Context} from 'koa';
import {passport} from '../config/passport.js';

// TODO: fix this so it happens under the hood.
declare module 'koa' {
  interface Context extends ExtendableContext {}
}

export async function post(ctx: Context, next: Next) {
  ctx.log.trace({body: ctx.request.body});
  await passport.authenticate('local', async (error, user, info, status) => {
    ctx.log.trace({error, user, info, status}); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    if (user) {
      await ctx.login(user);
      ctx.redirect('/admin');
    } else {
      ctx.status = 400;
      ctx.redirect('/');
    }
  })(ctx, next);
}
