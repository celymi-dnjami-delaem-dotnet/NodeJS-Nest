import { IBaseDb } from './base-db.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IProductRepository {
    getProductById: (id: string) => Promise<ServiceResult<IBaseDb>>;
    createProduct: (productEntity: IBaseDb) => Promise<IBaseDb>;
    updateProduct: (productSchema: IBaseDb) => Promise<ServiceResult<IBaseDb>>;
    softRemoveProduct: (id: string) => Promise<ServiceResult>;
    removeProduct: (id: string) => Promise<ServiceResult>;
}

export const ProductRepositoryName = 'IProductRepository';
