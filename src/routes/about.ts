import {type Context} from 'koa';
import {type Props} from 'views/about.jsx';

export async function get(ctx: Context) {
  await ctx.render<Props>('about');
}
