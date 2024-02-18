import {type Middleware} from 'koa';
import {type JSX} from 'preact';
import Layout from '../../components/layout.js';
import SideNav from '../../components/side-nav.js';

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

  const {default: Doc} = (await import(
    /* @vite-ignore */
    '../../components/partials/docs/' + (ctx.request.params?.page ?? '') + '.js'
  )) as {default: () => JSX.Element};

  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div class="col-2">
          <SideNav />
        </div>
        <div id="docs-content" class="col-10 p-5">
          <Doc />
        </div>
      </div>
    </Layout>,
  );
};
