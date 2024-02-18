import {getCtx} from '../server.js';
import Nav from './nav.js';

export type Props = {
  readonly title?: string;
};

export default function Header({title}: Props) {
  const ctx = getCtx();

  return (
    <header className="w-100">
      <Nav ctx={ctx} />
      <h1>{title}</h1>
    </header>
  );
}
