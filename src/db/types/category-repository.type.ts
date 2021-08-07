import { IBaseDb } from './base-db.type';
import { ICreateCategory } from './create-category.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface ICategoryRepository {
    getCategories: () => Promise<IBaseDb[]>;
    getCategoryById: (id: string) => Promise<ServiceResult<IBaseDb>>;
    createCategory: (category: ICreateCategory) => Promise<IBaseDb>;
    updateCategory: (category: IBaseDb) => Promise<ServiceResult<IBaseDb>>;
    softRemoveCategory: (id: string) => Promise<ServiceResult>;
    removeCategory: (id: string) => Promise<ServiceResult>;
}

export const CategoryRepositoryName = 'ICategoryRepository';
