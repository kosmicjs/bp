import type {Context, Next} from 'koa';
import argon2 from 'argon2';
import {z} from 'zod';
import {userSchema} from '../models/user.js';
import {db} from '../db/index.js';

const bodyValidator = userSchema
  .pick({
    first_name: true,
    last_name: true,
    password_confirm: true,
    phone: true,
    email: true,
  })
  .partial({
    first_name: true,
    last_name: true,
    phone: true,
  })
  .required({
    email: true,
  })
  .extend({
    password: z.string().min(1),
    password_confirm: z.string().min(1),
  });

export async function post(ctx: Context, next: Next) {
  const userData = bodyValidator.parse(ctx.request.body);

  const {
    password,
    password_confirm: passwordConfirm,
    ...insertableUser
  } = userData;

  if (!passwordConfirm || passwordConfirm !== password) {
    ctx.req.log.error(
      new Error('Password and password confirmation do not match'),
    );
    ctx.redirect('/');
  }

  const hash = await argon2.hash(password);

  const user = await db
    .insertInto('users')
    .values({
      ...insertableUser,
      hash,
    })
    .returning(['email', 'id'])
    .executeTakeFirstOrThrow();

  await ctx.login(user);

  ctx.redirect('/users');
}
