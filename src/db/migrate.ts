import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import {FileMigrationProvider, Migrator} from 'kysely';
import logger from '../config/logger.js';
import {db} from './index.js';

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, 'migrations'),
  }),
});

if (process.argv[2] === 'up') {
  logger.info('Migrating up');
  await migrator.migrateToLatest();
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
}

if (process.argv[2] === 'down') {
  logger.info('Migrating down');
  const results = await migrator.migrateDown();

  logger.info(results);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
}

process.on('unhandledRejection', (error) => {
  logger.error(error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});
