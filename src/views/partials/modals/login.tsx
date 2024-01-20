export type Props = {
  readonly isSignup: boolean;
};

export default function LoginModalBody({isSignup}: Props) {
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
      <form action="/login" method="post">
        <div class="modal-body">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              name="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" class="form-text">
              {`We'll never share your email with anyone else.`}
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              class="form-control"
              id="exampleInputPassword1"
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
