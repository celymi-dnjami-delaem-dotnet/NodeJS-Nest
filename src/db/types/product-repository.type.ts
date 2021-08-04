import { CreateProductSchema } from '../mongo/schemas/create-product.schema';
import { Product } from '../mongo/schemas/product.schema';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IProductRepository {
    getProductById: (id: string) => Promise<ServiceResult<Product>>;
    createProduct: (productEntity: CreateProductSchema) => Promise<Product>;
    updateProduct: (productSchema: Product) => Promise<ServiceResult<Product>>;
    softRemoveProduct: (id: string) => Promise<ServiceResult>;
    removeProduct: (id: string) => Promise<ServiceResult>;
}

export const ProductRepositoryName = 'IProductRepository';
