import http from 'node:http';
import test from 'ava';
import Koa from 'koa';
import Xspence from '../src/index';

test('Exposes static function static', (t) => {
  t.true(typeof Xspence.static === 'function');
});

test('exposes static function bodyParser', (t) => {
  t.true(typeof Xspence.bodyParser === 'function');
});

test('app is a koa instance', (t) => {
  const app = new Xspence();
  t.true(app instanceof Koa);
});

test('app.server is a http Server instance', (t) => {
  const app = new Xspence();
  t.true(app.server instanceof http.Server);
});

test('app.start is a function', (t) => {
  const app = new Xspence();
  t.true(typeof app.listen === 'function');
});

test('app.close is a function', (t) => {
  const app = new Xspence();
  t.true(typeof app.close === 'function');
});
