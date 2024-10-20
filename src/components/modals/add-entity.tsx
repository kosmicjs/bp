export default function AddEntity() {
  return (
    <>
      <div class="modal-header">
        <h5 class="modal-title">Login</h5>
        <button
          class="btn-close"
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>

      <div class="modal-body">
        <form
          hx-post="/admin/entities"
          hx-target="#entity-list"
          hx-swap="beforebegin"
        >
          <div class="mb-3">
            <label for="name" class="form-label">
              Name:
            </label>
            <input
              autoComplete="false"
              type="text"
              class="form-control form-control-disabled"
              name="name"
            />
          </div>
          <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">
            Add
          </button>
        </form>
      </div>
    </>
  );
}
