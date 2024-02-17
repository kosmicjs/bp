import {AsyncLocalStorage} from 'node:async_hooks';

export const ctxStorage = new AsyncLocalStorage();
