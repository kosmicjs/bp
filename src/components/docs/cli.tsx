import ActiveDevWarning from '../active-dev-warning.js';

export default function GettingStartedContent() {
  return (
    <div class="w-100 ">
      <h1 class="mb-5 w-100">CLI</h1>

      <ActiveDevWarning />

      <section>
        <h2 class="mb-5 w-100">
          <code class="bg-black p-2 rounded d-block">$ kosmic dev</code>
        </h2>
        <h2 class="mb-5">
          <code class="bg-black p-2 rounded d-block">$ kosmic build</code>
        </h2>
        <h2 class="mb-5">
          <code class="bg-black p-2 rounded d-block">$ kosmic start</code>
        </h2>
      </section>
    </div>
  );
}
