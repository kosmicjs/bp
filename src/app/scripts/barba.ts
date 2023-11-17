import barba from '@barba/core';
import htmx from 'htmx.org';
import {hydrateIslands} from './islands.js';
import {$} from './query.js';

const barbaTyped = barba as unknown as typeof barba.default;

barbaTyped.hooks.after(async () => {
  htmx.process($('main')!);
  hydrateIslands();
});

barbaTyped.init();
