/* eslint-disable unicorn/prefer-module */
import process from 'node:process';
import path from 'node:path';
import {type UserConfig, createLogger} from 'vite';
import {pino} from 'pino';

const viteLogger = pino({
  name: 'devsvr',
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : {transport: {target: 'pino-princess'}}),
});

const config: UserConfig = {
  root: path.join(__dirname, 'src', 'client'),
  build: {
    manifest: true,
    rollupOptions: {
      input: path.join(__dirname, 'src', 'client', 'scripts', 'index.ts'),
    },
    outDir: path.join(__dirname, 'dist', 'src', 'public'),
    emptyOutDir: true,
  },
  customLogger: {
    ...createLogger(),
    info: viteLogger.info.bind(viteLogger),
    warn: viteLogger.warn.bind(viteLogger),
    error: viteLogger.error.bind(viteLogger),
  },
};

export default config;
