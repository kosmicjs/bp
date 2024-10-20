import htmx from 'htmx.org';
import {Toast} from 'bootstrap';
import {initializeTooltips} from './tooltips.js';
import {initializeCodeCopy} from './copy.js';
import {initializeIslands} from './islands.js';
import {initializeProgressBar} from './progress-bar.js';
import {$} from './query.js';

let isError = false;

htmx.onLoad(function ($content) {
  initializeTooltips($content);
  initializeCodeCopy($content);
  initializeIslands($content);
  initializeProgressBar($content);

  if (isError) {
    const $toast = $('#toast');
    if ($toast) {
      const toast = new Toast($toast);
      toast.show();
    }

    isError = false;
  }
});

declare global {
  interface Event {
    detail?: {
      xhr?: XMLHttpRequest;
      shouldSwap?: boolean;
      isError?: boolean;
      target?: Element;
    };
  }
}

htmx.on('htmx:beforeSwap', function (evt) {
  if (
    // this lint rule is incorrectly triggering
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    evt.detail?.xhr?.status.toString().startsWith('5') ||
    evt.detail?.xhr?.status.toString().startsWith('4')
  ) {
    evt.detail.isError = false;
    evt.detail.shouldSwap = true;
    const toast = $('.toast > .toast-body');
    if (toast) {
      evt.detail.target = toast;
      isError = true;
    }
  }
});
