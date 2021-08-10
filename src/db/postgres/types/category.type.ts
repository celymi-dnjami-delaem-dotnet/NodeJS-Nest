import { IBaseDb } from '../../base-types/base-db.type';

export interface ICategory extends IBaseDb {
    id: string;
    displayName: string;
}
