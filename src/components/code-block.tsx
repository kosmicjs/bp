import clsx from 'clsx';
import hljs from 'highlight.js';
import dedent from 'dedent';

type Props = {
  readonly code: string;
  readonly filename?: string;
  readonly language?: string;
  readonly isMultiline?: boolean;
};

export default function CodeBlock({
  code,
  filename,
  isMultiline = false,
  language = 'javascript',
}: Props) {
  return (
    <>
      {isMultiline && filename ? (
        <div class="py-1 m-0 text-bg-secondary rounded-top text-center">
          {filename}
        </div>
      ) : null}
      <pre>
        <code
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: dedent`${isMultiline ? '' : '$ '}${hljs.highlight(code.trim(), {language}).value.trim()}`,
          }}
          class={clsx('bg-black p-2 mt-0 d-block cursor-pointer', {
            rounded: !isMultiline || !filename,
            'rounded-bottom': isMultiline && filename,
          })}
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="Copy to clipboard"
          data-code={dedent(code)}
        />
      </pre>
    </>
  );
}
