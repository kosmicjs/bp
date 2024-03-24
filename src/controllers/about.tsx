import {type Context} from 'koa';
import Layout from '../components/layout.js';

export async function get(ctx: Context) {
  await ctx.renderRaw(
    <Layout>
      <h1>ABOUT PAGE</h1>
      <p>This is the about page</p>
      <button
        className="btn btn-sm btn-secondary"
        type="button"
        hx-get="/modals/login"
        hx-target="#modal-content"
        hx-indicator="#modal-content"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        Launch demo modal
      </button>
    </Layout>,
  );
}
