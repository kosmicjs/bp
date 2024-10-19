// import process from 'node:process';
import {app} from './server.js';
import {config} from './config/index.js';

await app.start({
  host: config.host,
  port: config.port,
});

import.meta.hot?.on('vite:beforeFullReload', async (event) => {
  app.logger.trace({event}, 'vite:beforeFullReload');
  await app.close();
  await import('./db/index.js');
});
