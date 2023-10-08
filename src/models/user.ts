import type {Generated, Insertable, Selectable, Updateable} from 'kysely';

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
