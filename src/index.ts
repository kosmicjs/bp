import {app} from './server.js';

// import.meta.hot?.accept(async (...args) => {
//   console.log('accept callback', args);
//   await app.close();
// });

await app.start(3000);
app.logger.info('Server started on port 3000');
