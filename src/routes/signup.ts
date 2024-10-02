import type {Context, Next} from 'koa';
import argon2 from 'argon2';
import {z} from 'zod';
import * as User from '../models/users.js';
import {db} from '../db/index.js';

const bodyValidator = User.schema
  .pick({
    first_name: true,
    last_name: true,
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
  let userData: z.infer<typeof bodyValidator> = {
    email: '',
    password: '',
    password_confirm: '',
  };

  try {
    userData = bodyValidator.parse(ctx.request.body);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      ctx.req.log.error(error);

      if (ctx.session) {
        ctx.session.messages = error.issues.map((issue) => issue.message);
        ctx.session.save();
      }

      ctx.redirect('/');
      return;
    }

    throw error;
  }

  const {
    password,
    password_confirm: passwordConfirm,
    ...insertableUser
  } = userData;

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

  ctx.redirect('/admin');
}
