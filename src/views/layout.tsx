import {type ComponentChildren} from 'preact';
import Footer from './partials/footer.js';
import Header from './partials/header.js';

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
        <title>{title}</title>
        {env === 'development' ? (
          <>
            <script type="module" src="http://localhost:5173/@vite/client" />
            <script
              type="module"
              src="http://localhost:5173/scripts/index.ts"
            />
          </>
        ) : null}
      </head>
      <body
        className="container-fluid w-100 min-vh-100"
        data-barba="wrapper"
        data-barba-namespace="default"
        data-bs-theme="dark"
      >
        <Header />
        <main className="container h-75" data-barba="container">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
