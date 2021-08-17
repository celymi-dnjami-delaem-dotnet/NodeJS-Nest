import { ICreateProduct } from '../../base-types/create-product.type';

export interface ICreateProductSchema extends ICreateProduct {
    category: string;
}
