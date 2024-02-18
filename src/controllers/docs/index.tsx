import {type Middleware} from 'koa';
import Layout from '../../components/layout.js';
import SideNav from '../../components/side-nav.js';

export const get: Middleware = async (ctx, next) => {
  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div class="col-2">
          <SideNav />
        </div>
        <div id="docs-content" class="col-10 p-5">
          <div className="d-flex justify-content-center">
            <h2>Docs</h2>
          </div>
          <p>
            Welcome to Kosmic Docs! This is a work in progress, so please be
            patient.
          </p>
        </div>
      </div>
    </Layout>,
  );
};
