export type Props = Record<string, unknown>;

export default function Nav() {
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          **LOGO**
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/docs">
                Docs
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/docs">
                Test
              </a>
            </li>
          </ul>
          <div>
            <button
              class="btn btn-outline-success"
              type="button"
              hx-get="/modals/login"
              hx-target="#modal-content"
              hx-indicator="#modal-content"
              hx-swap="innerHTML"
              data-bs-toggle="modal"
              data-bs-target="#modal"
            >
              Login
            </button>
            <button
              class="btn btn-outline-success"
              type="button"
              hx-get="/modals/signup"
              hx-target="#modal-content"
              hx-indicator="#modal-content"
              hx-swap="innerHTML"
              data-bs-toggle="modal"
              data-bs-target="#modal"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
