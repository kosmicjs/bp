import {hydrate} from 'preact';
import camelcase from 'camelcase';
import * as Islands from '../../views/components/islands/index.js';
import {$$} from './query.js';

/**
 * If you want to use your jsx views as preact components on the front end
 * you can easily implement an islands like architecture with preact.hydrate
 *
 * Simply wrap the component you want to hydate with a div with an id,
 * find the container component and hydrate it on the front-end with preact.hydrate
 *
 * In this way, only the component you want to hydrate will be loaded and re-rendered on the front-end
 *
 * We strongly reccomend you only reach for this as a last resort when htmx is not enough
 * for client side interactions. If you start reaching for this too much, you should consider
 * using a more robust front-end metaframework like next or remix.
 */
export const hydrateIslands = () => {
  const $islands = $$<HTMLElement>('[data-island]');

  for (const $island of $islands) {
    const islandName = camelcase($island.dataset?.island ?? '', {
      pascalCase: true,
    });
    const Component = Islands[islandName as keyof typeof Islands];
    if (Component) hydrate(<Component />, $island);
  }
};
