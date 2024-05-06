import type {Generated, Insertable, Selectable, Updateable} from 'kysely';
import zod from 'zod';

export const schema = zod.object({
  id: zod.number().int().positive().optional(),
  first_name: zod.string().max(255).optional(),
  last_name: zod.string().max(255).optional(),
  phone: zod.string().max(255).optional(),
  email: zod.string().max(255).email(),
  hash: zod.string().max(255).optional(),
  google_access_token: zod.string().max(255).optional(),
  google_refresh_token: zod.string().max(255).optional(),
});

export type UserTable = {
  id: Generated<number>;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email: string;
  hash?: string;
  google_access_token?: string;
  google_refresh_token?: string;
};

export type SelectableUser = Selectable<UserTable>;

export type InsertableUser = Insertable<UserTable>;

export type UpdatedableUser = Updateable<UserTable>;
