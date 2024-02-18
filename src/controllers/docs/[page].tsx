import {type Middleware} from 'koa';
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
  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div class="col-2">
          <SideNav />
        </div>
        <div class="col-10">
          <h1>Getting Started</h1>
          <figure class="text-center">
            <blockquote class="blockquote">
              <p>
                <strong>IMPORTANT:</strong>Kosmic is currently under active
                development
              </p>
            </blockquote>
            <figcaption class="blockquote-footer">
              Love from
              <cite title="Source Title">Spencer and the Kosmic dev team</cite>
            </figcaption>
          </figure>

          <p />

          <h2>Using partials</h2>

          <p>
            Partials are reusable components that can be used in multiple views.
            They are located in <code>src/views/partials</code>.
          </p>
        </div>
      </div>
    </Layout>,
  );
};
