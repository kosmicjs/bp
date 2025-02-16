import {type Kysely} from 'kysely';
import logger from '../../utils/logger.js';

export async function up(db: Kysely<any>): Promise<void> {
  logger.debug('Creating table users...');

  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .addColumn('first_name', 'varchar')
    .addColumn('last_name', 'varchar')
    .addColumn('phone', 'varchar')
    .addColumn('email', 'varchar')
    .addColumn('hash', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamp')
    .addColumn('updated_at', 'timestamp')
    .addColumn('google_refresh_token', 'varchar')
    .addColumn('google_access_token', 'varchar')
    .execute();

  logger.info('Created table users');

  logger.debug('Creating table entity...');

  await db.schema
    .createTable('entities')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.references('users.id'))
    .addColumn('name', 'varchar')
    .addColumn('description', 'varchar')
    .addColumn('created_at', 'timestamp')
    .addColumn('updated_at', 'timestamp')
    .execute();

  logger.info('Created table entity');
}

export async function down(db: Kysely<any>): Promise<void> {
  logger.debug('Dropping table users...');

  await db.schema.dropTable('users').cascade().execute();
  await db.schema.dropTable('entities').cascade().execute();

  logger.info('Dropped table users');
}
