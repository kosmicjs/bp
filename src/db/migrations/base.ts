import {type Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('first_name', 'varchar')
    .addColumn('last_name', 'varchar')
    .addColumn('phone', 'varchar')
    .addColumn('email', 'varchar')
    .addColumn('hash', 'varchar')
    .addColumn('salt', 'varchar')
    .addColumn('created_at', 'timestamp')
    .addColumn('updated_at', 'timestamp')
    .addColumn('google_refresh_token', 'varchar')
    .addColumn('google_access_token', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
