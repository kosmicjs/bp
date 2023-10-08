import {type Middleware} from 'koa';

export const get: Middleware = async function (ctx) {
  await ctx.render('index', {});
};
