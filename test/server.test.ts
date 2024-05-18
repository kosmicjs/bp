import {describe, test, expect, beforeAll, afterAll} from 'vitest';
import got from 'got';
import {app} from '../src/server.js';
import {type Kosmic} from '../packages/core/index.js';

describe('server integration', async () => {
  let server: Kosmic;
  beforeAll(async () => {
    server = await app.start({
      host: 'localhost',
      port: 4567,
    });
  });

  test('GET / 200 ok', async () => {
    const response = await got('http://localhost:4567');

    expect(response.statusCode).toEqual(200);
  });

  afterAll(async () => {
    await server.close();
  });
});
