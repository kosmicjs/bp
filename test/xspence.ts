import http from 'node:http';
import type {TestFn as TestInterface} from 'ava';
import anyTest from 'ava';
// import got from 'got';
import {Kosmic} from '../packages/core/index.js';

const test = anyTest as TestInterface<{
  app: Kosmic;
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
  const app = new Kosmic();
  t.context.app = app;
  t.context.port = port;
  t.context.address = `http://localhost:${port}`;
});

test('app is a koa instance', (t) => {
  const {app} = t.context;
  t.true(app instanceof Kosmic);
});

test.afterEach(async (t) => {
  await t.context.app.close();
});
