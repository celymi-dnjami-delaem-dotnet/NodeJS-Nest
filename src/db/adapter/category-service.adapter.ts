import { CategoryCommand } from '../../bl/commands/out/category.command';
import { CategoryMapperName, ICategoryMapper } from '../mappers/types/category-mapper.type';
import { CategoryRepositoryName, ICategoryRepository } from '../types/category-repository.type';
import { CreateCategoryCommand } from '../../bl/commands/in/create-category.command';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface ICategoryServiceAdapter {
    getCategories: () => Promise<CategoryCommand[]>;
    getCategoryById: (id: string) => Promise<ServiceResult<CategoryCommand>>;
    createCategory: (category: CreateCategoryCommand) => Promise<CategoryCommand>;
    updateCategory: (category: CategoryCommand) => Promise<ServiceResult<CategoryCommand>>;
    softRemoveCategory: (id: string) => Promise<ServiceResult>;
    removeCategory: (id: string) => Promise<ServiceResult>;
}

export const CategoryServiceAdapterName = Symbol('ICategoryServiceAdapter');

@Injectable({ scope: Scope.REQUEST })
export class CategoryServiceAdapter implements ICategoryServiceAdapter {
    constructor(
        @Inject(CategoryRepositoryName) private readonly _categoryRepository: ICategoryRepository,
        @Inject(CategoryMapperName) private readonly _categoryMapper: ICategoryMapper,
    ) {}

    async getCategories(): Promise<CategoryCommand[]> {
        const categories = await this._categoryRepository.getCategories();

        return categories.map(this._categoryMapper.mapToCommandFromDb);
    }

    async getCategoryById(id: string): Promise<ServiceResult<CategoryCommand>> {
        const { serviceResultType, exceptionMessage, data } = await this._categoryRepository.getCategoryById(id);

        return new ServiceResult<CategoryCommand>(
            serviceResultType,
            data && this._categoryMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async createCategory(category: CreateCategoryCommand): Promise<CategoryCommand> {
        const mappedCategory = this._categoryMapper.mapCreateToDbFromCommand(category);

        const createdCategory = await this._categoryRepository.createCategory(mappedCategory);

        return this._categoryMapper.mapToCommandFromDb(createdCategory);
    }

    async updateCategory(category: CategoryCommand): Promise<ServiceResult<CategoryCommand>> {
        const updateCategoryDb = this._categoryMapper.mapToDbFromCommand(category);

        const { exceptionMessage, serviceResultType, data } = await this._categoryRepository.updateCategory(
            updateCategoryDb,
        );

        return new ServiceResult<CategoryCommand>(
            serviceResultType,
            data && this._categoryMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        return this._categoryRepository.softRemoveCategory(id);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        return this._categoryRepository.removeCategory(id);
    }
}
