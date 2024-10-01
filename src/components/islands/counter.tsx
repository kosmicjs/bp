import {useState} from 'preact/hooks';

export default function Counter({
  initialCount = 0,
}: {
  readonly initialCount?: number;
}) {
  const [count, setCount] = useState(initialCount);

  return (
    <button
      type="button"
      class="btn btn-secondary"
      onClick={() => {
        setCount(count + 1);
      }}
    >
      {count}
    </button>
  );
}
