export default function SignupModalBody() {
  return (
    <>
      <div class="modal-header">
        <h5 class="modal-title">Signup</h5>
        <button
          class="btn-close"
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <form hx-boost="true" action="/signup" method="post">
        <div class="modal-body">
          <div class="mb-3">
            <label for="email" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              name="email"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" class="form-text">
              We&apos;ll never share your email with anyone else.
            </div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">
              Password
            </label>
            <input type="password" name="password" class="form-control" />
          </div>

          <div class="mb-3">
            <label for="password_confirm" class="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirm"
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
