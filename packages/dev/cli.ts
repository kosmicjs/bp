#!/usr/bin/env node
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs/promises';
import meow from 'meow';
import z from 'zod';
import {$} from 'execa';

const cli = meow(
  `
  Usage
    $ kosmic

  Options
    analyze           Analyze the project
      --cwd             Working directory for the command
    build             Build the project
      --cwd             Working directory for the command
    dev               Run in development mode
      --cwd             Working directory for the command
    migrate           Run migrations
      --down            Run down migrations
      --production, -p  Run in production mode
      --cwd             Working directory for the command
    start             Start the project
      --cwd             Working directory for the command
`,
  {
    importMeta: import.meta,
    flags: {
      cwd: {
        type: 'string',
        default: process.cwd(),
      },
      production: {
        type: 'boolean',
        shortFlag: 'p',
        default: false,
      },
      down: {
        type: 'boolean',
        default: false,
      },
    },
  },
);

const inputSchema = z.enum([
  'dev',
  'start',
  'migrate',
  'build',
  'analyze',
  'test',
]);

const input = inputSchema.parse(cli.input[0]);

const $$ = $({cwd: cli.flags.cwd, stdio: 'inherit'});
const $$$ = $$({env: {NODE_ENV: 'production'}});

const clean = async () =>
  Promise.all([
    fs.rm(path.join(cli.flags.cwd, 'dist'), {recursive: true, force: true}),
    fs.rm(path.join(cli.flags.cwd, 'src/public/assets'), {
      recursive: true,
      force: true,
    }),
    fs.rm(path.join(cli.flags.cwd, 'src/public/.vite'), {
      recursive: true,
      force: true,
    }),
  ]);

const compile = async () => {
  await $$`tsc`;
  await $$`vite build`;
};

const dev = async () => $$`vite-node ./packages/dev/index.ts`;

if (input === 'dev') {
  await dev();
}

if (input === 'start') {
  await (cli.flags.production ? $$$`node dist/src/index.js` : dev());
}

if (input === 'migrate') {
  await (cli.flags.production ? $$$ : $$$)({
    env: {KOSMIC_ENV: 'migration'},
  })`vite-node src/db/migrate.ts ${cli.flags.down ? 'down' : 'up'}`;
}

if (input === 'build') {
  await clean();
  await compile();
}
