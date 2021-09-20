import { IBaseProduct } from './base-product.type';
import { ICreateProduct } from './create-product.type';
import { ISearchParamsProduct } from './search-params-product.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IProductRepository {
    getProducts: (searchParams: ISearchParamsProduct) => Promise<IBaseProduct[]>;
    getProductById: (id: string) => Promise<ServiceResult<IBaseProduct>>;
    createProduct: (productEntity: ICreateProduct) => Promise<ServiceResult<IBaseProduct>>;
    updateProduct: (productSchema: IBaseProduct) => Promise<ServiceResult<IBaseProduct>>;
    softRemoveProduct: (id: string) => Promise<ServiceResult>;
    removeProduct: (id: string) => Promise<ServiceResult>;
    removeAllProducts: () => Promise<ServiceResult>;
}

export const ProductRepositoryName = Symbol('IProductRepository');
