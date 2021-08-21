import { IBaseDb } from './base-db.type';
import { ICreateCategoryDb } from './create-category.type';
import { ISearchParamsCategory } from './search-params-category.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface ICategoryRepository {
    getCategories: (limit: number, offset: number) => Promise<IBaseDb[]>;
    getCategoryById: (id: string, dbSearchParams: ISearchParamsCategory) => Promise<ServiceResult<IBaseDb>>;
    createCategory: (category: ICreateCategoryDb) => Promise<IBaseDb>;
    updateCategory: (category: IBaseDb) => Promise<ServiceResult<IBaseDb>>;
    softRemoveCategory: (id: string) => Promise<ServiceResult>;
    removeCategory: (id: string) => Promise<ServiceResult>;
}

export const CategoryRepositoryName = Symbol('ICategoryRepository');
