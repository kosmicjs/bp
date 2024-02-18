import process from 'node:process';
import {type ComponentChildren} from 'preact';
import {getCtx} from '../../packages/core/index.js';
import Footer from './footer.js';
import Header from './header.js';
import Modal from './modal.js';

export type Props = {
  readonly children: ComponentChildren;
  readonly title?: string;
  readonly env?: string;
};

function Css({files}: {readonly files?: string[]}) {
  if (!files) return null;
  return (
    <>
      {files.map((fileName) => (
        <link key={fileName} rel="stylesheet" href={fileName} />
      ))}
    </>
  );
}

function Script({file}: {readonly file?: string}) {
  if (!file) return null;
  return <script type="module" src={file} />;
}

export default function Layout({
  children,
  title,
  env = process.env.NODE_ENV,
}: Props) {
  const ctx = getCtx();

  const foundManifest = ctx.locals.manifest?.['scripts/index.ts'];

  return (
    <html lang="en">
      <head>
        <meta charset="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>{title}</title>
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {env === 'development' ? (
          <>
            <script type="module" src="http://localhost:5173/@vite/client" />
            <script
              type="module"
              src="http://localhost:5173/scripts/index.ts"
            />
          </>
        ) : (
          <>
            <Script file={foundManifest?.file} />
            <Css files={foundManifest?.css} />
          </>
        )}
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
        <Modal />
      </body>
    </html>
  );
}
