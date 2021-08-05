import { IBaseDb } from '../../types/base-db.type';
import { IProductRepository } from '../../types/product-repository.type';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';

export class ProductTypeOrmRepository implements IProductRepository {
    createProduct(productEntity: IBaseDb): Promise<IBaseDb> {
        return Promise.resolve(undefined);
    }

    getProductById(id: string): Promise<ServiceResult<IBaseDb>> {
        return Promise.resolve(undefined);
    }

    updateProduct(productSchema: IBaseDb): Promise<ServiceResult<IBaseDb>> {
        return Promise.resolve(undefined);
    }

    removeProduct(id: string): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }

    softRemoveProduct(id: string): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }
}
