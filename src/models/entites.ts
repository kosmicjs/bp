import type {Generated, Insertable, Selectable, Updateable} from 'kysely';
import zod from 'zod';

export const schema = zod.object({
  id: zod.number().int().positive().optional(),
  user_id: zod.number().int().positive().optional(),
  name: zod.string().min(1).max(255),
});

export type Entity = {
  id: Generated<number>;
  user_id: number;
  name: string;
};

export type SelectableEntity = Selectable<Entity>;

export type InsertableEntity = Insertable<Entity>;

export type UpdatedableEntity = Updateable<Entity>;
