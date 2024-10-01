import {type Middleware} from 'koa';
import {type Use} from 'packages/fs-router/types.js';
import Layout from '../../components/layout.js';

export const use: Use = async (ctx, next) => {
  if (!ctx.isAuthenticated())
    throw new Error('Must be authenticated to view this information');
  await next();
};

export const get: Middleware = async (ctx, next) => {
  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div class="col-10 p-5">
          <div className="d-flex justify-content-center">
            <h2>Accounts</h2>
          </div>
        </div>
      </div>
    </Layout>,
  );
};
