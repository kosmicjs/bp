import pkg, {type QueryResult, type QueryResultRow} from 'pg';
import type {SQLStatement} from 'sql-template-strings';
import logger from '../config/logger.js';
import {config} from '../config/index.js';

const {Pool} = pkg;

export * from 'sql-template-strings';

export const pool = new Pool({
  ...config.pg,
});

pool.on('connect', () => {
  logger.trace('postgres connected');
});

pool.on('error', (error) => {
  logger.error(error);
});

pool.on('release', () => {
  logger.trace('postgres release');
});

pool.on('remove', () => {
  logger.trace('postgres removed');
});

pool.on('acquire', () => {
  logger.trace('postgres acquired');
});

export async function query<T extends QueryResultRow>(
  q: string | SQLStatement,
): Promise<QueryResult<T>> {
  const client = await pool.connect();

  const queryResult = await client.query(q);

  client.release();

  return queryResult;
}
