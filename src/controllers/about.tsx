import {type Context} from 'koa';
import Layout from '../components/layout.js';

export async function get(ctx: Context) {
  await ctx.renderRaw(
    <Layout>
      <h1>ABOUT PAGE oh no</h1>
      <p>This is my first jsx oh boy template!</p>
      <p>You are on the homepage</p>
      <p>About</p>
      <p>This is ahhh the about pa ofoge!</p>
      <button
        className="btn btn-sm btn-secondary"
        type="button"
        hx-get="/modals/login"
        hx-target="#modal-content"
        hx-indicator="#modal-content"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        Launch demo modal bLAH
      </button>
    </Layout>,
  );
}
