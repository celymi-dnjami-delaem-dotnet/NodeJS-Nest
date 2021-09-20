import { IBaseProduct } from '../../base-types/base-product.type';
import { IRating } from './rating.type';

export interface IProduct extends IBaseProduct {
    id: string;
    ratings?: IRating[];
}
