import Layout from './layout.js';
import Modal from './components/modal.js';
import Counter from './islands/counter.js';

export type Props = {
  readonly title: string;
  readonly description: string;
};

function Index(props: Props) {
  return (
    <Layout>
      <h1>Kosmic TS</h1>
      <p>Less abstractions, all the same features!</p>
      <p>
        Kosmic is all about getting back to the roots of web-development. React
        server components are a cool idea, but honestly, they are full of magic
        and are very hard to understand. Their development has taken _years_ and
        the initial delivery of them has been lack luster, full of bugs, and
        difficulties for developers. Kosmic is a way to get back to the roots of
        web-development, but still have all the same features that React server
        components promise.
      </p>
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
      <div class="border border-rounded p-2 mt-2">
        <div>
          Hello from Preact! This is a small island of Preact that is hydrated
          and given interactivity on the client side.
        </div>
        <div data-island="counter">
          <Counter />
        </div>
      </div>
      <Modal />
    </Layout>
  );
}

export default Index;
