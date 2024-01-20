import path from 'node:path';
import {type UserConfig, createLogger} from 'vite';
import {pino} from 'pino';

const viteLogger = pino({name: 'vite', transport: {target: 'pino-princess'}});

const config: UserConfig = {
  root: path.join(__dirname, 'src/client'), // eslint-disable-line unicorn/prefer-module,
  build: {
    manifest: true,
    rollupOptions: {
      input: path.join(__dirname, 'src/client/scripts/index.ts'), // eslint-disable-line unicorn/prefer-module
    },
  },
  customLogger: {
    ...createLogger(),
    info: viteLogger.info.bind(viteLogger),
    warn: viteLogger.warn.bind(viteLogger),
    error: viteLogger.error.bind(viteLogger),
  },
};

export default config;
