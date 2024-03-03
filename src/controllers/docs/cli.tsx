import {type Middleware} from 'koa';
import Layout from '../../components/layout.js';
import ActiveDevWarning from '../../components/active-dev-warning.js';
import CodeBlock from '../../components/code-block.js';
import SideNav from '../../components/side-nav.js';

export const get: Middleware = async (ctx) => {
  await ctx.renderRaw(
    <Layout ctx={ctx}>
      <div class="row">
        <div class="col-2">
          <SideNav ctx={ctx} />
        </div>
        <div class="col-10 p-5">
          <div class="w-100 ">
            <h1 class="mb-5 w-100">CLI</h1>

            <ActiveDevWarning />

            <section>
              <h2 class="mb-5">
                <CodeBlock code="kosmic dev" />
              </h2>
              <h2 class="mb-5">
                <CodeBlock code="kosmic build" />
              </h2>
              <h2 class="mb-5">
                <CodeBlock code="kosmic start" />
              </h2>
            </section>
          </div>
        </div>
      </div>
    </Layout>,
  );
};
