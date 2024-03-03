import {type Middleware} from 'koa';
import DocsLayout from '../../components/docs-layout.js';
import CodeBlock from '../../components/code-block.js';

export const get: Middleware = async (ctx) => {
  await ctx.renderRaw(
    <DocsLayout>
      <h2 class="mb-5">
        <CodeBlock language="bash" code="kosmic dev" />
      </h2>
      <h2 class="mb-5">
        <CodeBlock code="kosmic build" />
      </h2>
      <h2 class="mb-5">
        <CodeBlock code="kosmic start" />
      </h2>
    </DocsLayout>,
  );
};
