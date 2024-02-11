import {type Locals} from 'koa';
import Nav from './nav.js';

export type Props = {
  readonly title?: string;
} & Locals;

export default function Header({title, ctx}: Props) {
  return (
    <header className="w-100">
      <Nav ctx={ctx} />
      <h1>{title}</h1>
    </header>
  );
}
