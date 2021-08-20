import { IBaseDb } from './base-db.type';

export interface IBaseUser extends IBaseDb {
    firstName: string;
    lastName: string;
    password?: string;
}
