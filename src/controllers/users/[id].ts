import {type Middleware, type Context, type Next} from 'koa';
import {db} from '../../db/index.js';
import {type UpdatedableUser, userSchema} from '../../models/user.js';

declare module 'koa' {
  interface Context extends ExtendableContext {}
}

export const use: Middleware[] = [
  async (ctx, next) => {
    if (!ctx.isAuthenticated())
      throw new Error('Must be authenticated to view this information');
    await next();
  },
];

export const get: Middleware = async (ctx, next) => {
  return ctx.render('users', {id: ctx.params?.id});
};

export const put = async (ctx: Context<{params: {id: number}}>, next: Next) => {
  if (!ctx.state.params?.id) throw new Error('id is required');

  const userData: UpdatedableUser = userSchema
    .pick({
      first_name: true,
      last_name: true,
      phone: true,
      email: true,
    })
    .parse(ctx.request.body);

  const user = await db
    .updateTable('users')
    .set(userData)
    .where('id', '=', ctx.state.params.id)
    .returningAll()
    .executeTakeFirstOrThrow();

  ctx.req.log.info(user, 'updated user');

  ctx.body = user;
};
