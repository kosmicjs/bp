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
