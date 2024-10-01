import {type Middleware} from 'koa';
import {type Use} from 'packages/fs-router/types.js';
import Layout from '../../../components/layout.js';

export const use: Use = {};

export const get: Middleware = async (ctx, next) => {
  if (!ctx.isAuthenticated())
    throw new Error('Must be authenticated to view this information');
  await next();
  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div class="col-10 p-5">
          <div className="d-flex justify-content-center">
            <h2>Appliances</h2>
          </div>
        </div>

        <div>
          <button type="button" class="btn btn-link">
            <a href="/admin/appliances/new">++ New Appliance</a>
          </button>
        </div>

        {/* <form action={`/users/${ctx.state.user.id}`} method="put">
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
        </form> */}
      </div>
    </Layout>,
  );
};
