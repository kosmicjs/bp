import path from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import fs from 'node:fs/promises';
import {FileMigrationProvider, Migrator} from 'kysely';
import logger from '../config/logger.js';
import {db} from './index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, 'migrations'),
  }),
});

if (process.argv[2] === 'up') {
  await migrator.migrateToLatest();
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
}

if (process.argv[2] === 'down') {
  const results = await migrator.migrateDown();

  logger.info(results);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
}
