import {type Middleware} from 'koa';
import {type Use} from 'packages/fs-router/types.js';
import Layout from '../../components/layout.js';

export const use: Use = async (ctx, next) => {
  if (!ctx.state.user) throw new Error('cleep blah blo dee ');
  await next();
};

export const get: Middleware = async (ctx, next) => {
  if (!ctx.state.user)
    throw new Error('A validated user is required to view this page');
  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div class="col-10 p-5">
          <div className="d-flex justify-content-center">
            <h2>Admin</h2>
          </div>
          <p>Welcome to your future admin panel, {ctx.state.user.email}</p>
          <form action={`/users/${ctx.state.user.id}`} method="put">
            <div class="mb-3">
              <label for="first_name" class="form-label">
                Email:
              </label>
              <input
                disabled
                type="text"
                value={ctx.state.user.email}
                class="form-control form-control-disabled"
                name="email"
                id="email"
              />
            </div>
            <div class="mb-3">
              <label for="first_name" class="form-label">
                First Name:
              </label>
              <input
                type="text"
                value={ctx.state.user.first_name}
                class="form-control"
                name="first_name"
              />
            </div>
            <div class="mb-3">
              <label for="first_name" class="form-label">
                Last Name:
              </label>
              <input
                type="text"
                value={ctx.state.user.last_name}
                class="form-control"
                name="last_name"
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
