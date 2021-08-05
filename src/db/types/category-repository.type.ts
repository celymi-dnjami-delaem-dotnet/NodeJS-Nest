import { IBaseDb } from './base-db.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface ICategoryRepository {
    getCategoryById: (id: string) => Promise<ServiceResult<IBaseDb>>;
    createCategory: (category: IBaseDb) => Promise<IBaseDb>;
    updateCategory: (category: IBaseDb) => Promise<ServiceResult<IBaseDb>>;
    addProductToCategory: (categoryId: string, productId: string) => Promise<ServiceResult<IBaseDb>>;
    softRemoveCategory: (id: string) => Promise<ServiceResult>;
    removeCategory: (id: string) => Promise<ServiceResult>;
}

export const CategoryRepositoryName = 'ICategoryRepository';
