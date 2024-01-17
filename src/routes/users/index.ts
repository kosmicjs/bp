import type {Context, Next, Middleware} from 'koa';
import {type InsertableUser, userSchema} from '../../models/user.js';
import {db} from '../../db/index.js';

export async function get(ctx: Context, next: Next) {
  const users = await db.selectFrom('users').selectAll().execute();

  ctx.req.log.info(users, 'users');

  ctx.body = users;
}

export async function post(ctx: Context, next: Next) {
  const user: InsertableUser = userSchema.parse(ctx.request.body);

  const updatedUser = await db
    .insertInto('users')
    .values(user)
    .returning('id')
    .execute();

  ctx.req.log.info({...user}, 'req.body');

  ctx.body = updatedUser;
}

export async function useGet(ctx: Context, next: Next) {
  await next();
}

export const use: {get?: Middleware} = {get: useGet};
