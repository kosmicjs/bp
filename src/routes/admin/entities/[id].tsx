import {type Context, type Next} from 'koa';
import {db} from '../../../db/index.js';

export const del = async (ctx: Context, next: Next) => {
  if (!ctx.params?.id) throw new Error('id is required');

  ctx.log.debug(
    {...(ctx.params as Record<string, unknown>)},
    'deleting entity...',
  );

  await db
    .deleteFrom('entities')
    .where('id', '=', Number.parseInt(ctx.params.id, 10))
    .execute();

  ctx.req.log.info({id: ctx.params.id}, 'deleted entity');

  ctx.status = 200;
  ctx.body = 'ok';
};

export const get = async (ctx: Context, next: Next) => {
  if (!ctx.params?.id) throw new Error('id is required');

  const entity = await db
    .selectFrom('entities')
    .where('id', '=', Number.parseInt(ctx.params.id, 10))
    .selectAll()
    .executeTakeFirstOrThrow();

  ctx.log.debug({entity}, 'fetched entity');

  ctx.status = 200;
  await ctx.render(
    <div class="col-12 p-5" id={`entity${entity.id}`}>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">
            <input placeholder={entity.name ?? ''}></input>
          </h5>
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
              class="btn btn-outline-danger"
            >
              x
            </button>
          </div>
        </div>
      </div>
    </div>,
  );
};
