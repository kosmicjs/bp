import {type Context, type Next} from 'koa';

declare module 'koa' {
  interface Context extends ExtendableContext {}
}

export async function get(ctx: Context, next: Next) {
  ctx.logout();
  ctx.redirect('/');
}
