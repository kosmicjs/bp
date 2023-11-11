import Nav from './nav.js';

export type Props = {
  readonly title?: string;
};

export default function Header({title}: Props) {
  return (
    <header className="w-100">
      <Nav />
      <h1>{title}</h1>
    </header>
  );
}
