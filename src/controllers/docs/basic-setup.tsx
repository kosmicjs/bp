import {type Middleware} from 'koa';
import DocsLayout from '../../components/docs-layout.js';
import CodeBlock from '../../components/code-block.js';

export const get: Middleware = async (ctx) => {
  await ctx.renderRaw(
    <DocsLayout>
      <h2 class="mb-5">Setup</h2>
      <p>
        Create a new file called <code>server.js</code> and add the following
        code:
      </p>
      <CodeBlock
        isMultiline
        filename="server.js"
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
          };
        `}
      />
      <p>
        The block above imports Kosmic and instantiates the app with the Kosmic
        builder pattern.
      </p>
    </DocsLayout>,
  );
};
