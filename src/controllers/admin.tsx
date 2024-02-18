import {type Middleware} from 'koa';
import Layout from '../components/layout.js';

export const useGet: Middleware[] = [
  async (ctx, next) => {
    if (!ctx.isAuthenticated())
      throw new Error('Must be authenticated to view this information');
    await next();
  },
];

export const get: Middleware = async (ctx, next) => {
  if (!ctx.state.user)
    throw new Error('A validated user is required to view this page');

  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div id="docs-content" class="col-10 p-5">
          <div className="d-flex justify-content-center">
            <h2>Admin</h2>
          </div>
          <p>Welcome to your future admin panel, {ctx.state.user.email}</p>
        </div>
      </div>
    </Layout>,
  );
};
