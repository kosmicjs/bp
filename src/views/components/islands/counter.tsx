// eslint-disable-next-line n/file-extension-in-import
import {useState} from 'preact/hooks';

export default function Counter() {
  const [count, setCount] = useState(0);

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
