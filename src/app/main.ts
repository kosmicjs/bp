// add the beginning of your app entry
// eslint-disable-next-line import/no-unassigned-import
import 'vite/modulepreload-polyfill';
// eslint-disable-next-line import/no-unassigned-import
import './bling.js';

console.log('ey bay bya');

const $body = document.querySelector('body');

$body?.on('click', 'p', () => {
  console.log('clicked!');
});
