import type {Context, Next} from 'koa';
import argon2 from 'argon2';
import z from 'zod';
import * as User from '#models/users.js';
import {db} from '#db/index.js';

export async function post(ctx: Context, next: Next) {
  const userData = await User.validateInsertableUser(ctx.request.body);

  const passwords = await z
    .object({
      password: z.string().min(8).max(255),
      password_confirm: z.string().min(8).max(255),
    })
    .parseAsync(ctx.request.body);

  const {password, password_confirm: passwordConfirm} = passwords;

  if (!passwordConfirm || passwordConfirm !== password) {
    ctx.req.log.error(
      new Error('Password and password confirmation do not match'),
    );
    if (ctx.session) {
      ctx.session.messages = [
        'Password and password confirmation do not match',
      ];
      ctx.session.save();
    }

    ctx.redirect('/');
  }

  const hash = await argon2.hash(passwords.password);

  const user = await db
    .insertInto('users')
    .values({
      ...userData,
      hash,
    })
    .returning(['email', 'id'])
    .executeTakeFirstOrThrow();

  await ctx.login(user);

  ctx.redirect('/admin');
}
