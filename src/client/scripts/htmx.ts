import htmx from 'htmx.org';
import {initializeTooltips} from './tooltips.js';
import {initializeCodeCopy} from './copy.js';
import {initializeIslands} from './islands.js';
import {initializeProgressBar} from './progress-bar.js';

htmx.onLoad(function ($content) {
  initializeTooltips($content);
  initializeCodeCopy($content);
  initializeIslands($content);
  initializeProgressBar($content);
});

// htmx.logger = function (elt, event, data) {
//   if (console && ['htmx:afterSettle', 'htmx:beforeSend'].includes(event)) {
//     // eslint-disable-next-line no-console
//     console.log(event, elt, data);
//   }
// };
