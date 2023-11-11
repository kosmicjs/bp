import {type FunctionComponent} from 'preact';
import Layout from './layout.js';
import SideNav from './partials/side-nav.js';

export type Props = {
  // readonly description: string;
};

// eslint-disable-next-line react/function-component-definition
const Index: FunctionComponent<Props> = (props: Props) => {
  return (
    <Layout>
      <div class="row">
        <div class="col-6">
          <SideNav />
        </div>
        <div id="docs-content" class="col-6">
          <h2>Default content</h2>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
