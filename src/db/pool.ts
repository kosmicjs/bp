import pkg from 'pg';
import type {QueryResult, QueryResultRow} from 'pg';
import type {SQLStatement} from 'sql-template-strings';
import {Kysely, PostgresDialect} from 'kysely';
import logger from '../config/logger.js';

const {Pool} = pkg;

export * from 'sql-template-strings';

export const pool = new Pool({
  host: 'localhost',
  database: 'spencer',
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.debug('postgres connected');
});

pool.on('error', (error) => {
  logger.error(error);
});

export async function query<T extends QueryResultRow>(
  q: string | SQLStatement,
): Promise<QueryResult<T>> {
  const client = await pool.connect();

  const queryResult = await client.query(q);

  client.release();

  return queryResult;
}
