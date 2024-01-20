import {type Middleware} from 'koa';

declare module 'koa' {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface Params {
    /**
     * The partial to render.
     *
     * TODO: validate this string better for security
     */
    partial?: string;
  }
}

export const get: Middleware = async (ctx) => {
  ctx.log.debug(`Rendering partial "${ctx.request.params?.partial}"`);
  await ctx.render(`partials/modals/${ctx.request.params?.partial}`, {});
};
