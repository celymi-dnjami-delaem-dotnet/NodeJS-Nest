import { IBaseDb } from './base-db.type';
import { ICreateProduct } from './create-product.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IProductRepository {
    getProductById: (id: string) => Promise<ServiceResult<IBaseDb>>;
    createProduct: (productEntity: ICreateProduct) => Promise<ServiceResult<IBaseDb>>;
    updateProduct: (productSchema: IBaseDb) => Promise<ServiceResult<IBaseDb>>;
    softRemoveProduct: (id: string) => Promise<ServiceResult>;
    removeProduct: (id: string) => Promise<ServiceResult>;
}

export const ProductRepositoryName = 'IProductRepository';
