import {test, expect} from 'vitest';
import {createFsRouter} from './index.js';

test('createFsRouter', async () => {
  expect(typeof createFsRouter).is('function');
});
