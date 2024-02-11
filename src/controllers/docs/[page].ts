import {type Middleware} from 'koa';

declare module 'koa' {
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
  await ctx.render(`partials/docs/${ctx.request.params?.page}`, {});
};
