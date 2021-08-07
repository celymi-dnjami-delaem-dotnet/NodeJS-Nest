import { ICreateProduct } from '../../types/create-product.type';

export interface ICreateProductEntity extends ICreateProduct {
    categoryId: string;
}
