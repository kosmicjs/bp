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
            <h1 class="mb-5 w-100">Basic Setup</h1>

            <ActiveDevWarning />

            <section>
              <h2 class="mb-5">Setup</h2>
              <CodeBlock
                isMultiline
                code={`
                  import url from 'node:url';
                  import path from 'node:path';
                  import {createPinoMiddleware} from '../packages/pino-http/index.js';
                  import {Kosmic} from '../packages/core/index.js';
                  import logger from './config/logger.js';

                  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
                  const routesDir = path.join(__dirname, 'controllers');

                  export const app = new Kosmic()
                    .withFsRouter(routesDir)
                    .injectLogger(logger)
                    .withBodyParser({enableTypes: ['json', 'form', 'text']})
                    .withErrorHandler()
                    .withStaticFiles(path.join(__dirname, 'public'))
                    .injectHttpLoggingMiddleware(createPinoMiddleware({logger}))
                    .withSession();

                  export const getCtx = () => {
                    const ctx = app.currentContext;
                    if (!ctx) throw new Error('No context found');
                    return ctx;
                  };`}
              />
            </section>
          </div>
        </div>
      </div>
    </Layout>,
  );
};
