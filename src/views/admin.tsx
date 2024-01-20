import {type SelectableUser} from '../models/user.js';
import Layout from './layout.js';

export type Props = {
  readonly user: SelectableUser;
};

function Admin(props: Props) {
  return (
    <Layout>
      <div class="row">
        <div id="docs-content" class="col-10 p-5">
          <div className="d-flex justify-content-center">
            <h2>Admin</h2>
          </div>
          <p>Welcome to your future admin panel, {props.user.email}</p>
        </div>
      </div>
    </Layout>
  );
}

export default Admin;
