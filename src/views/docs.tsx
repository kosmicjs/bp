import {type FunctionComponent} from 'preact';
import Layout from './layout.js';
import Modal from './partials/modal.js';
import SideNav from './partials/side-nav.js';

export type Props = {
  // readonly description: string;
};

// eslint-disable-next-line react/function-component-definition
const Index: FunctionComponent<Props> = (props: Props) => {
  return (
    <Layout>
      <SideNav />
      <Modal />
    </Layout>
  );
};

export default Index;
