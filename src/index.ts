// import process from 'node:process';
import {app} from './server.js';
import {config} from './config/index.js';

await app.start({
  host: config.host,
  port: config.port,
});
