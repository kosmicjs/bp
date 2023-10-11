import {type Middleware} from 'koa';
import {type Props} from 'views/index.js';

export const get: Middleware = async function (ctx) {
  await ctx.render<Props>('index', {
    title: 'test',
    description: 'test',
  });
};
