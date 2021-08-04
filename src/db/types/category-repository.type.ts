import { Category } from '../mongo/schemas/category.schema';
import { CreateCategorySchema } from '../mongo/schemas/create-category.schema';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface ICategoryRepository {
    getCategoryById: (id: string) => Promise<ServiceResult<Category>>;
    createCategory: (category: CreateCategorySchema) => Promise<Category>;
    updateCategory: (category: Category) => Promise<ServiceResult<Category>>;
    addProductToCategory: (categoryId: string, productId: string) => Promise<ServiceResult>;
    softRemoveCategory: (id: string) => Promise<ServiceResult>;
    removeCategory: (id: string) => Promise<ServiceResult>;
}

export const CategoryRepositoryName = 'ICategoryRepository';
