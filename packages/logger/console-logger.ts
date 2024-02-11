/* eslint-disable no-console */
import {type Logger} from './logger.interface.js';

export class ConsoleLogger implements Logger {
  prefix?: string;

  constructor({prefix}: {prefix?: string} = {}) {
    this.prefix = prefix;
  }

  trace(logs: Parameters<typeof console.trace>): void {
    console.trace(this.prefix, ...logs);
  }

  debug(logs: Parameters<typeof console.debug>): void {
    console.debug(this.prefix, ...logs);
  }

  info(logs: Parameters<typeof console.info>): void {
    console.info(this.prefix, ...logs);
  }

  warn(logs: Parameters<typeof console.warn>): void {
    console.warn(this.prefix, ...logs);
  }

  error(logs: Parameters<typeof console.error>): void {
    console.error(this.prefix, ...logs);
  }

  fatal(logs: Parameters<typeof console.error>): void {
    console.error(this.prefix, ...logs);
  }
}
