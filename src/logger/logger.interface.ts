export type LoggerMethods =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export interface Logger
  extends Record<LoggerMethods, (...logs: any[]) => void> {}
