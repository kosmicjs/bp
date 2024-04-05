import url from 'node:url';
import path from 'node:path';
import {type Middleware} from 'koa';
import Layout from '../components/layout.js';
import Counter from '../components/islands/counter.js';
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
  await ctx.renderRaw(
    <Layout>
      <div class="d-flex flex-column align-items-center mb-5">
        <h1>Kosmic</h1>
        <p class="text-secondary text-bg-warning p-2">
          Less abstractions, better features!
        </p>
      </div>

      <div class="border rounded border-warning p-2 mt-2">
        <div class="p-2">
          Hello from Preact! This is a small island of Preact that is hydrated
          and given interactivity on the client side.
        </div>
        <div class="p-2" data-island="counter">
          <Counter />
        </div>
      </div>
    </Layout>,
  );
};
