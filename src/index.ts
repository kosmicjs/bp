// import process from 'node:process';
import {app} from './server.js';
import {config} from './config/index.js';

await app.start({
  host: 'localhost',
  port: config.port,
});

// import.meta.hot?.accept(() => {
//   process?.send?.('reload');
// });
