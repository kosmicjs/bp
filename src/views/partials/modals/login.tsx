export default function LoginModalBody() {
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
        <p>this will be a login modal some day</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">
          Close
        </button>
        <button class="btn btn-primary" type="button">
          Login
        </button>
      </div>
    </>
  );
}
