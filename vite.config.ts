import path from 'node:path';
import {type UserConfig} from 'vite';

const config: UserConfig = {
  root: path.join(__dirname, 'src/app'), // eslint-disable-line unicorn/prefer-module,
  build: {
    manifest: true,
    rollupOptions: {
      input: path.join(__dirname, 'src/app/scripts/main.ts'), // eslint-disable-line unicorn/prefer-module
    },
  },
};

export default config;
