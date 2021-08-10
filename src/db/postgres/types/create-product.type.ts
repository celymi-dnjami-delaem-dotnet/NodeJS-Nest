import { ICreateProduct } from '../../base-types/create-product.type';

export interface ICreateProductEntity extends ICreateProduct {
    categoryId: string;
}
