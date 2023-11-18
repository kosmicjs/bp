import {type Context} from 'koa';
import {type Props} from 'views/about.jsx';

export async function get(ctx: Context) {
  await ctx.render<Props>('about', {
    title: 'About',
    description:
      'Kosmic is a framework for building web apps with Koa and Preact as a template engine.',
  });
}
