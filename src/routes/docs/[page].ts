import {setTimeout} from 'node:timers/promises';
import {type Middleware} from 'koa';

declare module 'koa' {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface Params {
    /**
     * The partial to render.
     *
     * TODO: validate this string better for security
     */
    page?: string;
  }
}

export const get: Middleware = async (ctx) => {
  ctx.log.debug(`Rendering partial "${ctx.request.params?.page}"`);
  await setTimeout(2000);
  await ctx.render(`partials/docs/${ctx.request.params?.page}`, {});
};
