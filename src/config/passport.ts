// import process from 'node:process';
import passport from 'koa-passport';
import {Strategy as LocalStrategy} from 'passport-local';
// import {
//   Strategy as GoogleStrategy,
//   type Profile,
//   type VerifyCallback,
// } from 'passport-google-oauth20';
import argon2 from 'argon2';
import {type SelectableUser} from '../models/user.js';
import {db} from './db/index.js';
import logger from './logger.js';

// const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

declare module 'koa' {
  interface State {
    user?: SelectableUser;
  }
}

// @ts-expect-error crappy 3rd party type
passport.serializeUser((user: SelectableUser, done) => {
  logger.debug({user}, 'serializing user');
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    logger.debug({user}, 'deserialized user');

    if (user) done(null, user);
    else done(null, false);
  } catch (error: unknown) {
    logger.error(error);
    done(error);
  }
});

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        if (!email) {
          throw new Error('Username is required');
        }

        if (!password) {
          throw new Error('Password is required');
        }

        const user = await db
          .selectFrom('users')
          .selectAll()
          .where('email', '=', email)
          .executeTakeFirst();

        if (user?.hash && !(await argon2.verify(user?.hash, password))) {
          throw new Error('Invalid email or password');
        }

        if (user) done(null, user);
        else done(null, false);
      } catch (error: unknown) {
        logger.error(error);
        done(null, false);
      }
    },
  ),
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID!,
//       clientSecret: GOOGLE_CLIENT_SECRET!,
//       scope: [
//         'https://www.googleapis.com/auth/userinfo.profile',
//         'https://www.googleapis.com/auth/userinfo.email',
//       ],
//       callbackURL: 'http://localhost:3000/auth/google/callback',
//     },
//     async function (
//       accessToken,
//       refreshToken,
//       profile: Profile,
//       cb: VerifyCallback,
//     ) {
//       logger.debug(
//         {accessToken, refreshToken, profile},
//         'google profile response',
//       );

//       if (!profile.emails?.[0].value) {
//         cb(new Error('No email found in profile'));
//         return;
//       }

//       let user = await db
//         .selectFrom('users')
//         .selectAll()
//         .where('email', '=', profile.emails[0].value)
//         .executeTakeFirst();

//       if (user) {
//         cb(null, user);
//         return;
//       }

//       try {
//         user = await db
//           .insertInto('users')
//           .values({
//             first_name: profile.name?.givenName,
//             last_name: profile.name?.familyName,
//             email: profile.emails[0].value,
//             google_access_token: accessToken,
//             google_refresh_token: refreshToken,
//           })
//           .returningAll()
//           .executeTakeFirstOrThrow();
//       } catch (error) {
//         logger.error(error);
//         throw error;
//       }

//       cb(null, user);
//     },
//   ),
// );

// eslint-disable-next-line unicorn/prefer-export-from
export {passport};
