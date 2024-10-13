import {Kysely, PostgresDialect} from 'kysely';
import type {Database} from '../models/index.js';
import {TimestampsPlugin} from './plugins/timestamps.js';
import {pool} from './pool.js';

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool,
  }),
  plugins: [new TimestampsPlugin()],
});
