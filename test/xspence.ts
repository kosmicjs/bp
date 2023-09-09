import http from 'node:http';
import type {TestFn as TestInterface} from 'ava';
import anyTest from 'ava';
// import got from 'got';
import Xspence from '../src/index';

const test = anyTest as TestInterface<{
  app: Xspence;
  port: number;
  address: string;
}>;

test.beforeEach(async (t) => {
  const srv = http.createServer();
  const {port}: {port: number} = await new Promise((resolve, reject) => {
    srv.listen(() => {
      srv.on('error', reject);
      const address = srv.address();
      if (typeof address === 'string' || !address) {
        resolve({port: 5432});
      } else {
        resolve(address);
      }

      srv.close();
    });
  });
  const app = new Xspence();
  t.context.app = app;
  t.context.port = port;
  t.context.address = `http://localhost:${port}`;
});

test('app is a koa instance', (t) => {
  const {app} = t.context;
  t.true(app instanceof Xspence);
});

test.afterEach(async (t) => {
  await t.context.app.close();
});
