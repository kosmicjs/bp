import {$} from './query.js';

export function initializeProgressBar($content: Element) {
  $content.on('htmx:afterSwap', function () {
    const $progressBar = $('.progress-bar');
    $progressBar?.classList.add('w-100');
    setTimeout(() => {
      $progressBar?.classList.remove('w-100');
    }, 200);
  });
  $content.on('htmx:beforeRequest', () =>
    $('.progress-bar')?.classList.add('w-50'),
  );
}
