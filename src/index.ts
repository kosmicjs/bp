// import process from 'node:process';
import {app} from './server.js';
import {config} from './config/index.js';

await app.start({
  host: 'localhost',
  port: config.port,
});

// import.meta.hot?.accept(async (args: unknown) => {
//   app.logger.info({args}, 'accept: sending reload');
//   await app.close();
//   process?.send?.('reload');
// });

// import.meta.hot?.dispose(async (args: unknown) => {
//   app.logger.info({args}, 'dispose: sending reload');
//   await app.close();
//   process?.send?.('reload');
// });

import.meta.hot?.on('vite:beforeFullReload', async () => {
  app.logger.debug('vite:beforeFullReload event called: closing app');
  await app.close();
});
