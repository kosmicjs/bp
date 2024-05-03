import type {Middleware} from 'koa';
import Layout from '../../src/components/layout.js';

export const get: Middleware = async (ctx) => {
  await ctx.renderRaw(
    <Layout>
      <div class="d-flex justify-content-center mb-5">
        <h1>Pricing</h1>
      </div>
      <div class="border border-warning rounded p-3">
        <p>
          Our pricing is simple and straightforward. You pay a flat rate of $10
          per month for unlimited access to all of our features.
        </p>
      </div>
    </Layout>,
  );
};
