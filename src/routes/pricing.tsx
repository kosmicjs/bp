/* eslint-disable react/style-prop-object */
import type {Middleware} from 'koa';
import Layout from '../../src/components/layout.js';

export const get: Middleware = async (ctx) => {
  await ctx.renderRaw(
    <Layout>
      <div class="d-flex flex-column justify-content-center">
        <h1 class="mb-5 align-self-center">Pricing</h1>
        <div class="border-start border-3 border-warning rounded p-3 align-self-center mb-5">
          <p>
            Our pricing is simple and straightforward. You pay a flat rate of
            $10 per month for unlimited access to all of our features.
          </p>
        </div>
        <div class="d-flex justify-content-around flex-wrap">
          <div
            class="card m-2 text-center border-warning"
            style="width: 18rem;height:30rem;"
          >
            <img src="/favicon-32x32.png" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title text-center">Free</h5>
              <p class="card-text h1">$10</p>
              <a
                hx-boost="false"
                href="/checkout/standard"
                class="btn btn-warning"
              >
                Go somewhere
              </a>
            </div>
          </div>
          <div
            class="card m-2 text-center border-warning mt-5"
            style="width: 18rem;height:30rem;"
          >
            <img src="/favicon-32x32.png" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title text-center">Pro</h5>
              <p class="card-text h1">$10</p>
              <a href="/checkout/standard" class="btn btn-warning">
                Go somewhere
              </a>
            </div>
          </div>
          <div
            class="card m-2 text-center border-warning"
            style="width: 18rem;height:30rem;"
          >
            <img src="/favicon-32x32.png" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title text-center">Executive</h5>
              <p class="card-text h1">$10</p>
              <a href="/checkout/standard" class="btn btn-warning">
                Go somewhere
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>,
  );
};
