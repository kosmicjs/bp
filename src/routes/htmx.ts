import {type Context} from 'koa';

export async function get(ctx: Context) {
  await ctx.render('htmx', {title: 'HTMX Demo'});
}
