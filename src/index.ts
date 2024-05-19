// import process from 'node:process';
import {app} from './server.js';
import {config} from '#config';

await app.start({
  host: config.host,
  port: config.port,
});

import.meta.hot?.on('vite:beforeFullReload', async () => {
  app.logger.trace('vite:beforeFullReload event called: closing app');
  await app.close();
});
