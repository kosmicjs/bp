import {type Server} from 'node:http';
import {describe, test, expect, beforeAll, afterAll} from 'vitest';
import got from 'got';
import {createServer} from '../src/server.js';

describe('server integration', async () => {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();
    server.listen(4567);
  });

  test('GET / 200 ok', async () => {
    const response = await got('http://localhost:4567');

    expect(response.statusCode).toEqual(200);
  });

  afterAll(() => {
    server.closeAllConnections();
    server.close();
  });
});
