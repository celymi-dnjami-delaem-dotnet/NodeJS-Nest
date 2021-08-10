import { IBaseDb } from '../../base-types/base-db.type';

export interface ICategory extends IBaseDb {
    _id: string;
    displayName: string;
}
