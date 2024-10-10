import {type Middleware} from 'koa';
import Layout from '../../../components/layout.js';
import {db} from '../../../db/index.js';
import * as Entity from '../../../models/entites.js';

export const get: Middleware = async (ctx, next) => {
  if (!ctx.state.user) {
    throw new Error('Not logged in');
  }

  const entities = await db
    .selectFrom('entities')
    .selectAll()
    .where('entities.user_id', '=', ctx.state.user.id)
    .execute();

  ctx.log.debug({entities});

  await ctx.renderRaw(
    <Layout>
      <div class="row">
        <div class="col-10 p-5">
          <div className="d-flex justify-content-center">
            <h2>Entities</h2>
          </div>
        </div>

        <form
          hx-post="/admin/entities"
          hx-target="#entity-list"
          hx-swap="beforebegin"
        >
          <div class="mb-3">
            <label for="name" class="form-label">
              Name:
            </label>
            <input
              autoComplete="false"
              type="text"
              class="form-control form-control-disabled"
              name="name"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            Add
          </button>
        </form>

        <div id="entity-list">
          {entities.map((entity) => (
            <div class="col-10 p-5" id={`entity${entity.id}`}>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{entity.name}</h5>
                  <p class="card-text">{entity.name}</p>
                  <div class="d-flex justify-content-between">
                    <button
                      type="button"
                      hx-post={`/admin/entities/${entity.id}`}
                      hx-target="#entity-list"
                      hx-swap="append"
                      class="btn btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      hx-delete={`/admin/entities/${entity.id}`}
                      hx-target={`#entity${entity.id}`}
                      hx-swap="delete"
                      class="btn btn-danger"
                    >
                      x
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>,
  );
};

export const post: Middleware = async (ctx, next) => {
  if (!ctx.state.user) {
    throw new Error('Not logged in');
  }

  const {name} = Entity.schema.parse(ctx.request.body);

  const entity = await db
    .insertInto('entities')
    .values({name, user_id: ctx.state.user.id})
    .returningAll()
    .executeTakeFirst();

  if (!entity) {
    throw new Error('Failed to create entity');
  }

  ctx.status = 201;
  await ctx.renderRaw(
    <div class="col-10 p-5" id={`entity${entity.id}`}>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{entity.name}</h5>
          <p class="card-text">{entity.name}</p>
          <button
            type="button"
            hx-post={`/admin/entities/${entity.id}`}
            hx-target="#entity-list"
            hx-swap="append"
            class="btn btn-primary"
          >
            Edit
          </button>
          <button
            type="button"
            hx-delete={`/admin/entities/${entity.id}`}
            hx-target={`#entity${entity.id}`}
            hx-swap="delete"
            class="btn btn-danger"
          >
            x
          </button>
        </div>
      </div>
    </div>,
  );
};
