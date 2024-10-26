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

export class User {
  id: Generated<number>;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email: string;
  hash?: string;
  google_access_token?: string;
  google_refresh_token?: string;

  constructor(data: User) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.phone = data.phone;
    this.email = data.email;
    this.hash = data.hash;
    this.google_access_token = data.google_access_token;
    this.google_refresh_token = data.google_refresh_token;
  }
}

export type SelectableUser = Selectable<User>;

export type InsertableUser = Insertable<User>;

export type UpdatedableUser = Updateable<User>;
