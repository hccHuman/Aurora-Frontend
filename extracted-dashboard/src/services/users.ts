import usersStaticJSON from '../../data/users.json' assert { type: 'json' };
import type { Users } from '../types/entities';

const usersStaticData: Users = usersStaticJSON;

export function getUsers() {
  return usersStaticData;
}
