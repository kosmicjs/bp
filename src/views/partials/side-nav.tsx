export default function SideNav() {
  return (
    <div class="list-group list-group-flush">
      <button
        type="button"
        class="list-group-item list-group-item-action"
        data-bs-toggle="collapse"
        data-bs-target="#home-collapse"
        aria-expanded="false"
      >
        Getting Started
      </button>
      <div class="collapse" id="home-collapse">
        <div class="list-group list-group-flush">
          <button
            type="button"
            class="list-group-item list-group-item-action text-end"
            hx-get="/docs/getting-started"
            hx-target="#docs-content"
          >
            Installation
          </button>
        </div>
      </div>
    </div>
  );
}
