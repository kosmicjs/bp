import url from 'node:url';
import path from 'node:path';
import {type Middleware} from 'koa';
import {type Props} from 'views/home.js';
import {type Use} from '../../packages/fs-router/types.js';
import {renderMiddleware as jsxRender} from '../../packages/render/jsx.middleware.js';
import {passport} from '../config/passport.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const use: Use = [
  passport.initialize({userProperty: 'email'}),
  passport.session(),
  await jsxRender(path.join(__dirname, '..', 'views')),
];

export const get: Middleware = async function (ctx) {
  await ctx.render<Props>('home', {
    title: 'Home',
    description:
      'Kosmic is a framework for building web apps with Koa and Preact as a template engine.',
  });
};
