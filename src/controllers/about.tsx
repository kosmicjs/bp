import {type Context} from 'koa';
import Layout from '../components/layout.js';

export async function get(ctx: Context) {
  await ctx.renderRaw(
    <Layout>
      <h2>Welcome to My ABOUT PAGE</h2>
      <p>This is my first Pug template!</p>
      <p>You are on the homepage</p>
      <p>About</p>
      <p>This is the about page!</p>
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
    </Layout>,
  );
}
