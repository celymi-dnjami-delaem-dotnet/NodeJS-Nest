import { IBaseRating } from './base-rating.type';

export interface IBaseLastRating extends IBaseRating {
    userName: string;
    productName: string;
}
