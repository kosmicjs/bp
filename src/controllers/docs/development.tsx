import {type Middleware} from 'koa';
import DocsLayout from '../../components/docs-layout.js';

export const get: Middleware = async (ctx) => {
  await ctx.renderRaw(
    <DocsLayout>
      <h2 class="mb-5">How it works</h2>

      <p>
        Kosmic aims to have a first class developer experience with modern
        development features.Those features include live reloading and hot
        reloading all code where possible. Under the hood, Kosmic heavily relies
        on vite to power the dev experience.
      </p>
    </DocsLayout>,
  );
};
