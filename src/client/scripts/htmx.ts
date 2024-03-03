import htmx from 'htmx.org';
import {initializeTooltips} from './tooltips.js';
import {initializeCodeCopy} from './copy.js';
import {initializeIslands} from './islands.js';

htmx.onLoad(function ($content) {
  initializeTooltips($content);
  initializeCodeCopy($content);
  initializeIslands($content);
});
