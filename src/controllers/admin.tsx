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
          <form>
            <div class="mb-3">
              <label for="first_name" class="form-label">
                First Name
              </label>
              <input
                type="text"
                placeholder={ctx.state.user.first_name}
                class="form-control"
                name="first_name"
                id="first_name"
              />
            </div>
            <button type="submit" class="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>
    </Layout>,
  );
};

export const post: Middleware = async (ctx, next) => {
  if (!ctx.state.user)
    throw new Error('A validated user is required to view this page');

  // const {first_name} = ctx.request.body;

  // if (first_name) {
  //   ctx.state.user.first_name = first_name;
  //   await ctx.state.user.save();
  // }

  ctx.redirect('/admin');
  await next();
};
