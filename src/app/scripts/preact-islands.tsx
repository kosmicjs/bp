import {hydrate} from 'preact';
import Counter from '../../views/stateful/test.js';
import {$} from './query.js';

/**
 * If you want to use your jsx views as preact components on the front end
 * you can easily implement an islands like architecture with preact.hydrate
 *
 * Simply wrap the component you want to hydate with a div with an id,
 * find the container component and hydrate it on the front-end with preact.hydrate
 *
 * In this way, only the component you want to hydrate will be loaded and re-rendered on the front-end
 */

const $counterIsland = $('#counter');

if ($counterIsland) hydrate(<Counter />, $counterIsland);
