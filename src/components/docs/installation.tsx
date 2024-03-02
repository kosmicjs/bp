import ActiveDevWarning from '../active-dev-warning.js';

export default function GettingStartedContent() {
  return (
    <div>
      <h1 class="mb-5">Getting Started</h1>

      <ActiveDevWarning />

      <section>
        <h2 class="mb-5">Installation</h2>

        <p>
          To get started, install Kosmic by running the following command in
          your terminal:
        </p>
        <div class="bg-black col-5 p-2">
          <code>npm install @kosmic/core</code>
        </div>
      </section>
    </div>
  );
}
