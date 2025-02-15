import type {Context, Next} from 'koa';
import argon2 from 'argon2';
import z from 'zod';
import * as User from '#models/users.js';
import {db} from '#db/index.js';

const passwordSchema = z
  .string()
  .min(8)
  .max(255)
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must contain an uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must contain a lowercase letter',
  })
  .refine((password) => /\d/.test(password), {
    message: 'Password must contain a digit',
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Password must contain a special character',
  });

export async function post(ctx: Context, next: Next) {
  const userData = await User.validateInsertableUser(ctx.request.body);

  const passwords = await z
    .object({
      password: passwordSchema,
      password_confirm: passwordSchema,
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
