import {type Middleware} from 'koa';
import Layout from '../../components/layout.js';
import SideNav from '../../components/side-nav.js';
import ActiveDevWarning from '../../components/active-dev-warning.js';
import CodeBlock from '../../components/code-block.js';

export const get: Middleware = async (ctx) => {
  await ctx.renderRaw(
    <Layout ctx={ctx}>
      <div class="row">
        <div class="col-2">
          <SideNav ctx={ctx} />
        </div>
        <div class="col-10 p-5">
          <div>
            <h1 class="mb-5">Installation</h1>

            <ActiveDevWarning />

            <section>
              <h2 class="mb-5">Installation</h2>

              <p>
                To get started, install Kosmic by running the following command
                in your terminal:
              </p>
              <CodeBlock code="npm install @kosmic/core" />
            </section>
          </div>
        </div>
      </div>
    </Layout>,
  );
};
