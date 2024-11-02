import {type User} from './users.js';
import {type Entity} from './entites.js';

export type Database = {
  users: User;
  entities: Entity;
};

export {type User} from './users.js';

export {type Entity} from './entites.js';
