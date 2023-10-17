import 'vite/modulepreload-polyfill';
import '@popperjs/core';
import 'bootstrap';
import 'htmx.org';
import {io} from 'socket.io-client';
import '../styles/styles.scss';

declare global {
  interface Node {
    /**
     * Add event listener to a node and delegate to a selector jQuery style
     *
     * @param {string} name - Event name
     * @param {string} selector - optional CSS selector
     * @param {function} fn - Callback function
     */
    on(
      name: string,
      selector: string | ((...args: any) => unknown),
      fn?: (...args: any) => unknown,
    ): void;
  }
}

Node.prototype.on = function (name: string, selector, fn) {
  if (typeof selector === 'function') {
    this.addEventListener(name, selector);
    return;
  }

  this.addEventListener(name, function (event: Event) {
    if (
      fn &&
      selector &&
      event.target instanceof Element &&
      event.target?.matches(selector)
    ) {
      return fn.apply(event.target, arguments);
    }
  });
};

const socket = io('http://127.0.0.1:2222/');
socket.on('disconnect', () => {
  console.log('socket server disconnected');
});
socket.on('connect', () => {
  console.log('socket server connected');
});
socket.on('restart', (data) => {
  console.log('data', data);
  window.location.reload();
});
/**
 * An alias for document.querySelector
 */
const $ = document.querySelector.bind(document);
/**
 * An alias for document.querySelectorAll
 */
const $$ = document.querySelectorAll.bind(document);

const $body = $('body')!;
