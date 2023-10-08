import 'vite/modulepreload-polyfill';
import '../styles/styles.scss';
import './htmx';
import './bling.js';

const $body = document.querySelector('body')!;

$body.on('click', () => {
  console.log('clicked!');
});
