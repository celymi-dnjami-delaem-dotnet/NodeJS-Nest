import { CategoryDbMapperName, ICategoryDbMapper } from '../mappers/types/category-mapper.type';
import { CategoryRepositoryName, ICategoryRepository } from '../base-types/category-repository.type';
import { ICategoryCommand } from '../../bl/commands/category.command';
import { ICollectionSearchCommand } from '../../bl/commands/collection-search.command';
import { ICreateCategoryCommand } from '../../bl/commands/create-category.command';
import { ISearchParamsCategoryCommand } from '../../bl/commands/search-params-category.command';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface ICategoryServiceAdapter {
    getCategories: (collectionSearchCommand: ICollectionSearchCommand) => Promise<ICategoryCommand[]>;
    getCategoryById: (
        id: string,
        searchParams: ISearchParamsCategoryCommand,
    ) => Promise<ServiceResult<ICategoryCommand>>;
    createCategory: (category: ICreateCategoryCommand) => Promise<ICategoryCommand>;
    updateCategory: (category: ICategoryCommand) => Promise<ServiceResult<ICategoryCommand>>;
    softRemoveCategory: (id: string) => Promise<ServiceResult>;
    removeCategory: (id: string) => Promise<ServiceResult>;
    removeAllCategories: () => Promise<ServiceResult>;
}

export const CategoryServiceAdapterName = Symbol('ICategoryServiceAdapter');

@Injectable()
export class CategoryServiceAdapter implements ICategoryServiceAdapter {
    constructor(
        @Inject(CategoryRepositoryName) private readonly _categoryRepository: ICategoryRepository,
        @Inject(CategoryDbMapperName) private readonly _categoryMapper: ICategoryDbMapper,
    ) {}

    async getCategories({ limit, offset }: ICollectionSearchCommand): Promise<ICategoryCommand[]> {
        const categories = await this._categoryRepository.getCategories(limit, offset);

        return categories.map((x) => this._categoryMapper.mapToCommandFromDb(x));
    }

    async getCategoryById(
        id: string,
        searchParams: ISearchParamsCategoryCommand,
    ): Promise<ServiceResult<ICategoryCommand>> {
        const dbSearchParams = this._categoryMapper.mapSearchToDbFromCommand(searchParams);

        const { serviceResultType, exceptionMessage, data } = await this._categoryRepository.getCategoryById(
            id,
            dbSearchParams,
        );

        return new ServiceResult<ICategoryCommand>(
            serviceResultType,
            data && this._categoryMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async createCategory(category: ICreateCategoryCommand): Promise<ICategoryCommand> {
        const mappedCategory = this._categoryMapper.mapCreateToDbFromCommand(category);

        const createdCategory = await this._categoryRepository.createCategory(mappedCategory);

        return this._categoryMapper.mapToCommandFromDb(createdCategory);
    }

    async updateCategory(category: ICategoryCommand): Promise<ServiceResult<ICategoryCommand>> {
        const updateCategoryDb = this._categoryMapper.mapToDbFromCommand(category);

        const { serviceResultType, exceptionMessage, data } = await this._categoryRepository.updateCategory(
            updateCategoryDb,
        );

        return new ServiceResult<ICategoryCommand>(
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

    async removeAllCategories(): Promise<ServiceResult> {
        return this._categoryRepository.removeAllCategories();
    }
}
