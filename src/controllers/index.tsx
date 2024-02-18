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
      <h1>Kosmic TS</h1>
      <p>Less abstractions, all the same features!</p>
      <p>
        Kosmic is all about getting back to the roots of web-development. React
        server components are a cool idea, but honestly, they are full of magic
        and are very hard to understand. Their development has taken _years_ and
        the initial delivery of them has been lack luster, full of bugs, and
        difficulties for developers. Kosmic is a way to get back to the roots of
        web-development, but still have all the same features that React server
        components promise.
      </p>
      <p>Home</p>
      <p>Kosmic is the coolest</p>
      <button
        className="btn btn-sm btn-secondary"
        type="button"
        hx-get="/modals/login"
        hx-target="#modal-content"
        hx-indicator="#modal-content"
        hx-swap="innerHTML"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        Launch demo modal
      </button>
      <div class="border border-rounded p-2 mt-2">
        <div>
          Hello from Preact! This is a small island of Preact that is hydrated
          and given interactivity on the client side.
        </div>
        <div data-island="counter">
          <Counter />
        </div>
      </div>
    </Layout>,
  );
};
