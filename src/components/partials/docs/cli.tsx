export default function GettingStartedContent() {
  return (
    <div>
      <h1 class="mb-5">CLI</h1>

      <figure class="text-center mb-5">
        <blockquote class="blockquote">
          <p>
            <strong>IMPORTANT:</strong>Kosmic is currently under active
            development
          </p>
        </blockquote>
        <figcaption class="blockquote-footer">
          Love from{' '}
          <cite title="Source Title">Spencer and the Kosmic dev team</cite>
        </figcaption>
      </figure>

      <section>
        <h2 class="mb-5">
          <code>$ kosmic dev</code>
        </h2>

        <p>
          To get started, install Kosmic by running the following command in
          your terminal:
        </p>
        <div class="bg-black col-5 p-2">
          <code>$ npm install @kosmic/core</code>
        </div>
      </section>
    </div>
  );
}
