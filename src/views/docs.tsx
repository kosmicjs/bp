import {type Locals} from 'koa';
import {app} from '../server.js';
import Layout from './layout.js';
import SideNav from './components/side-nav.js';
import GettingStartedContent from './partials/docs/getting-started.js';

export type Props = {
  // readonly description: string;
} & Locals;

function Docs(properties: Props) {
  if (!app.currentContext) return null;

  const {query} = app.currentContext;

  return (
    <Layout ctx={properties.ctx}>
      <div class="row">
        <div class="col-2">
          <SideNav />
        </div>
        <div id="docs-content" class="col-10 p-5">
          {query ? (
            query.page === 'getting-started' ? (
              <GettingStartedContent />
            ) : null
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <h2>Docs</h2>
              </div>
              <p>
                Welcome to Kosmic Docs! This is a work in progress, so please be
                patient.
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Docs;
