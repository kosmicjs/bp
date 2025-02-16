import {type Server} from 'node:http';
import {describe, test, expect, beforeAll, afterAll} from 'vitest';
import got from 'got';
import {start, close} from '../src/core.js';

describe('server integration', async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let server: Server;

  beforeAll(async () => {
    server = await start({
      host: 'localhost',
      port: 4567,
    });
  });

  test('GET / 200 ok', async () => {
    const response = await got('http://localhost:4567');

    expect(response.statusCode).toEqual(200);
  });

  afterAll(async () => {
    await close();
  });
});
