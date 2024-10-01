import path from 'node:path';
import {type Middleware} from 'koa';
import Layout from '../components/layout.js';
import Counter from '../components/islands/counter.js';
import {type Use} from '../../packages/fs-router/types.js';
import {renderMiddleware as jsxRender} from '../../packages/render/jsx.middleware.js';
import {passport} from '../config/passport.js';

export const use: Use = [
  passport.initialize({userProperty: 'email'}),
  passport.session(),
  await jsxRender(path.join(import.meta.dirname, '..', 'views')),
];

declare module 'koa-session' {
  interface Session {
    messages: string[];
  }
}

export const get: Middleware = async function (ctx) {
  const messages = ctx.session?.messages ?? [];

  if (ctx.session) {
    ctx.session.messages = [];
    ctx.session.save();
  }

  await ctx.renderRaw(
    <Layout>
      <div class="text-center d-flex align-items-center justify-content-center margin-bottom-5 w-100 pb-5">
        <div
          class={`toast border-danger w-100 w-md-75 ${messages.length > 0 ? 'show' : ''}`}
        >
          <div class="toast-header border-danger-subtle">
            <strong class="m-auto">Oops!:</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="toast"
            ></button>
          </div>
          <div class="toast-body">
            {messages.map((message: string) => (
              <p>{message}</p>
            ))}
          </div>
        </div>
      </div>

      <div class="d-flex flex-column align-items-center mb-5">
        {['Koa', 'HTMX', 'Postgres'].map((tech, idx) => (
          <>
            <span class="h3 text-bg-info text-center p-2">{tech}</span>
            {idx === 2 ? null : <span class="h4 text-center">+</span>}
          </>
        ))}
      </div>

      <div class="d-flex flex-column align-items-center mb-5">
        <h1>Kosmic</h1>
        <p class="text-secondary text-bg-warning text-center p-2 text-center">
          Simple abstractions, deep code insight, fast development!
        </p>
      </div>

      <div class="d-flex flex-column align-items-center mb-5">
        {['TypeScript', 'Preact', 'Vite', 'Kysely'].map((tech, idx) => (
          <>
            <span class="h3 text-bg-info text-center p-2">{tech}</span>
            {idx === 3 ? null : <span class="h4 text-center">+</span>}
          </>
        ))}
      </div>

      <div class="border rounded border-warning p-2 mt-2">
        <div class="p-2">
          Hello from Preact! This is a small island of Preact that is hydrated
          and given interactivity on the client side.
        </div>
        <div
          class="p-2"
          data-island="counter"
          data-props={JSON.stringify({initialCount: 2})}
        >
          <Counter {...{initialCount: 2}} />
        </div>
      </div>
    </Layout>,
  );
};
