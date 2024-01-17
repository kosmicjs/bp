import process from 'node:process';
import {app} from './server.js';

await app.start({
  host: 'localhost',
  port: 3000,
});

import.meta.hot?.accept(() => {
  process?.send?.('reload');
});
