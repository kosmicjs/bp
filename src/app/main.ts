import 'vite/modulepreload-polyfill';
import './bling.js';

const $body = document.querySelector('body')!;

$body.on('click', () => {
  console.log('clicked!');
});
