import copyToClipboard from 'copy-to-clipboard';
import {Tooltip} from 'bootstrap';
import {$$} from './query.js';

export function initializeCodeCopy($el: Element) {
  const $code = $$('code', $el);

  for (const $el of $code) {
    if (!($el instanceof HTMLElement)) continue;
    let copiedTimeout: NodeJS.Timeout;
    $el.on('click', () => {
      if (!$el.textContent) {
        return;
      }

      if (copiedTimeout) {
        clearTimeout(copiedTimeout);
      }

      copyToClipboard($el.textContent.trim().slice(1).trim());
      const previousTooltip = Tooltip.getOrCreateInstance($el);
      previousTooltip.dispose();
      const copiedTip = new Tooltip($el, {
        title: 'Copied!',
      });
      copiedTip.show();
      copiedTimeout = setTimeout(() => {
        copiedTip.dispose();
        new Tooltip($el); // eslint-disable-line no-new
      }, 1000);
    });
  }
}
