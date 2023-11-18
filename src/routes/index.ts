import {type Middleware} from 'koa';
import {type Props} from 'views/index.js';

export const get: Middleware = async function (ctx) {
  await ctx.render<Props>('index', {
    title: 'Home',
    description:
      'Kosmic is a framework for building web apps with Koa and Preact as a template engine.',
  });
};
