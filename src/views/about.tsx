import {type Locals} from 'koa';
import Layout from './layout.js';
import Modal from './components/modal.js';

export type Props = {
  readonly title: string;
  readonly description: string;
} & Locals;

function Index(props: Props) {
  return (
    <Layout ctx={props.ctx}>
      <h2>Welcome to My ABOUT PAGE</h2>
      <p>This is my first Pug template!</p>
      <p>You are on the homepage</p>
      <p>{props.title}</p>
      <p>{props.description}</p>
      <button
        className="btn btn-sm btn-secondary"
        type="button"
        hx-get="/modals/login"
        hx-target="#modal-content"
        hx-indicator="#modal-content"
        hx-swap="innerHTML"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        Launch demo modal
      </button>
      <Modal />
    </Layout>
  );
}

export default Index;
