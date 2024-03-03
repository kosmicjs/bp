import path from 'node:path';
import {type ComponentChildren} from 'preact';
import humanize from 'humanize-string';
import titleize from 'titleize';
import {getCtx} from '../server.js';
import Layout from './layout.js';
import SideNav from './side-nav.js';
import ActiveDevWarning from './active-dev-warning.js';

type Props = {
  readonly pageName?: string;
  readonly children: ComponentChildren;
};

export default function DocsLayout({pageName, children}: Props) {
  const ctx = getCtx();

  if (!ctx) throw new Error('No context found');

  if (!ctx.originalUrl) throw new Error('No url found');

  const page = path.basename(ctx.originalUrl);

  return (
    <Layout>
      <div class="row">
        <div class="col-2">
          <SideNav pageName={page} />
        </div>
        <div class="col-10 ps-3 ">
          <div class="w-100 ">
            <h1 class="mb-5 w-100">{titleize(humanize(pageName ?? page))}</h1>

            <ActiveDevWarning />

            <section>{children}</section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
