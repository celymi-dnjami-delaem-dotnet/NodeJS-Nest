import { IBaseDb } from '../../types/base-db.type';

export interface ICategory extends IBaseDb {
    id: string;
    displayName: string;
}
