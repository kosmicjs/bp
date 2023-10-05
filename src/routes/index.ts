import {type Next, type Context, type Middleware} from 'koa';

export const get: Middleware = async function (ctx, next) {
  ctx.log.info('GET /');
  ctx.body = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Home</title>
    </head>
    <body>
      <h1>Home</h1>
      <p>
        <a href="/about">About</a>
      </p>
    </body>
  </html>
  `;
};
