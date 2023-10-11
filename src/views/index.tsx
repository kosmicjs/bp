import Layout from './layout.js';
import Modal from './partials/modal.js';

export type Props = {
  readonly title: string;
  readonly description: string;
};

export default function Index(props: Props) {
  return (
    <Layout>
      <h2>Welcome to My Website</h2>
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
