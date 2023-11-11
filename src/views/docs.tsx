import {type FunctionComponent} from 'preact';
import Layout from './layout.js';
import SideNav from './partials/side-nav.js';

export type Props = {
  // readonly description: string;
};

function Index(props: Props) {
  return (
    <Layout>
      <div class="row">
        <div class="col-2">
          <SideNav />
        </div>
        <div id="docs-content" class="col-10">
          <div className="d-flex justify-content-center">
            <h2>Docs</h2>
          </div>
          <p>
            Welcome to Kosmic Docs! This is a work in progress, so please be
            patient.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
