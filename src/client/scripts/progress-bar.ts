import {$} from './query.js';

let timeout: number;

export function initializeProgressBar($content: Element) {
  $content.on('htmx:beforeSend', () => {
    $('.progress-bar')?.classList.add('w-50');
  });

  $content.on('htmx:afterSettle', () => {
    const $progressBar = $('.progress-bar');
    $progressBar?.classList.add('w-100');
    if (timeout) clearTimeout(timeout);
    // @ts-expect-error - wrong setTimeout
    timeout = setTimeout(() => {
      $progressBar?.classList.remove('w-100');
      $progressBar?.classList.remove('w-50');
    }, 200);
  });
}
