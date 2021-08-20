import { IBaseDb } from './base-db.type';

export interface IBaseProduct extends IBaseDb {
    displayName: string;
    totalRating: number;
    price: number;
}
