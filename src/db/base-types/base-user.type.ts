import { IBaseDb } from './base-db.type';

export interface IBaseUser extends IBaseDb {
    userName: string;
    firstName: string;
    lastName: string;
    password?: string;
}
