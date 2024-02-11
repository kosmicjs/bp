import process from 'node:process';
import {type ComponentChildren} from 'preact';
import {type Locals} from 'koa';
import Footer from './components/footer.js';
import Header from './components/header.js';
import Modal from './components/modal.js';

export type Props = {
  readonly children: ComponentChildren;
  readonly title?: string;
  readonly env?: string;
} & Locals;

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
  ctx,
}: Props) {
  const foundManifest = ctx.locals.manifest?.['scripts/index.ts'];

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
        <Header ctx={ctx} />
        <main className="container h-75" data-barba="container">
          {children}
        </main>
        <Footer />
        <Modal />
      </body>
    </html>
  );
}
