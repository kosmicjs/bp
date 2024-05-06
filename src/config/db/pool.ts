import pkg, {type QueryResult, type QueryResultRow} from 'pg';
import type {SQLStatement} from 'sql-template-strings';
import logger from '../logger.js';
import {config} from '../index.js';

const {Pool} = pkg;

export * from 'sql-template-strings';

export const pool = new Pool({
  ...config.pg,
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
