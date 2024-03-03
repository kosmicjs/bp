import clsx from 'clsx';

export default function CodeBlock({code}: {readonly code: string}) {
  return (
    <code
      class={clsx('bg-black p-2 mt-3 rounded d-block cursor-pointer')}
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      data-bs-custom-class="code-tooltip"
      title="Copy to clipboard"
    >
      $ {code}
    </code>
  );
}
