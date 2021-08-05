import { IBaseDb } from '../../types/base-db.type';

export interface ICategory extends IBaseDb {
    _id: string;
    displayName: string;
}
