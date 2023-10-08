import {type Context} from 'koa';

export async function get(ctx: Context) {
  await ctx.render('about', {title: 'HTMX Demo'});
}
