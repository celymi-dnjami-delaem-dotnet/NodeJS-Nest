import { IBaseCategory } from './base-category.type';
import { ICreateCategoryDb } from './create-category.type';
import { ISearchParamsCategory } from './search-params-category.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface ICategoryRepository {
    getCategories: (limit: number, offset: number) => Promise<IBaseCategory[]>;
    getCategoryById: (id: string, dbSearchParams: ISearchParamsCategory) => Promise<ServiceResult<IBaseCategory>>;
    createCategory: (category: ICreateCategoryDb) => Promise<IBaseCategory>;
    updateCategory: (category: IBaseCategory) => Promise<ServiceResult<IBaseCategory>>;
    softRemoveCategory: (id: string) => Promise<ServiceResult>;
    removeCategory: (id: string) => Promise<ServiceResult>;
    removeAllCategories: () => Promise<ServiceResult>;
}

export const CategoryRepositoryName = Symbol('ICategoryRepository');
