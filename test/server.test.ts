import {describe, test, expect} from 'vitest';
import got from 'got';
import {app} from '../src/server.js';

describe('server integration', async () => {
  await app.start({
    host: 'localhost',
    port: 4567,
  });

  test('GET / 200 ok', async () => {
    const response = await got('http://localhost:4567');

    expect(response.statusCode).toEqual(200);
  });
});
