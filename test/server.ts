import {describe, test} from 'node:test';
import assert from 'node:assert';
import got from 'got';
import {app} from '../src/server.js';

await describe('server integration', async () => {
  await app.start({
    host: 'localhost',
    port: 3000,
  });

  await Promise.all([
    test('GET / 200 ok', async () => {
      const response = await got('http://localhost:3000');

      assert.strictEqual(response.statusCode, 200);
    }),
  ]);
});
