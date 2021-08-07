import { ICreateProduct } from '../../types/create-product.type';

export interface ICreateProductSchema extends ICreateProduct {
    category: string;
}
