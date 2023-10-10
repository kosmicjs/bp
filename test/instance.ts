import http from 'node:http';
import test from 'ava';
import {Kosmic} from '../packages/core/index.js';

test('Exposes static function static', (t) => {
  t.true(typeof Kosmic.static === 'function');
});

test('exposes static function bodyParser', (t) => {
  t.true(typeof Kosmic.bodyParser === 'function');
});

test('app.server is a http Server instance', (t) => {
  const app = new Kosmic();
  t.true(app.server instanceof http.Server);
});

test('app.start is a function', (t) => {
  const app = new Kosmic();
  t.true(typeof app.start === 'function');
});

test('app.close is a function', (t) => {
  const app = new Kosmic();
  t.true(typeof app.close === 'function');
});
