import type {Context, Next, Middleware} from 'koa';
import {type InsertableUser} from 'src/models/user.js';
import {db} from '../../db/index.js';

export async function get(ctx: Context, next: Next) {
  const users = await db.selectFrom('users').selectAll().execute();

  ctx.req.log.info(users, 'users');

  ctx.body = users;
}

export async function post(ctx: Context, next: Next) {
  const user = ctx.request?.body as InsertableUser;

  const updatedUser = await db
    .insertInto('users')
    .values(user)
    .returning('id')
    .execute();

  ctx.req.log.info({...user}, 'req.body');

  ctx.body = updatedUser;
}
