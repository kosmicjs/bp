import barba from '@barba/core';
import htmx from 'htmx.org';
import {hydrateIslands} from './islands.js';

const typedBarba = barba as unknown as typeof barba.default;

typedBarba.hooks.beforeEnter((viewData) => {
  htmx.process(viewData!.next.container);
  hydrateIslands();
});

typedBarba.init({
  transitions: [
    {
      name: 'self',
    },
  ],
});
