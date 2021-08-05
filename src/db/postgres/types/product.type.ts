import { IBaseDb } from '../../types/base-db.type';

export interface IProduct extends IBaseDb {
    id: string;
    displayName: string;
    totalRating: number;
    price: number;
}
