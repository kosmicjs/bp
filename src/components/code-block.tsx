/* eslint-disable react/no-danger */
import clsx from 'clsx';
import hljs from 'highlight.js';
import dedent from 'dedent';

type Props = {
  readonly code: string;
  readonly language?: string;
  readonly isMultiline?: boolean;
};

export default function CodeBlock({
  code,
  isMultiline = false,
  language = 'javascript',
}: Props) {
  return (
    <pre>
      javascript
      <code
        dangerouslySetInnerHTML={{
          __html: dedent`${isMultiline ? '' : '$ '}${hljs.highlight(code.trim(), {language}).value.trim()}`,
        }}
        class={clsx('bg-black p-2 mt-3 rounded d-block cursor-pointer')}
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="Copy to clipboard"
        data-code={code}
      />
    </pre>
  );
}
