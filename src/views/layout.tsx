import {type ComponentChildren} from 'preact';
import Nav from './partials/nav.js';

export type Props = {
  readonly children: ComponentChildren;
  readonly title?: string;
  readonly env?: string;
};

export default function Layout({children, title, env = 'development'}: Props) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>{title ?? 'My Website'}</title>
        {env === 'development' ? (
          <>
            <script type="module" src="http://localhost:5173/@vite/client" />
            <script type="module" src="http://localhost:5173/scripts/main.ts" />
          </>
        ) : null}
      </head>

      <body className="container w-100 h-100">
        <Nav />
        <header className="w-100">
          <h1>My Website</h1>
        </header>
        <main className="w-100">{children}</main>
        <footer className="w-100">
          <p>Copyright © 2021 My Website</p>
        </footer>
      </body>
    </html>
  );
}
