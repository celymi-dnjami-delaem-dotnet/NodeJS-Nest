import { CategoryBlMapperName, ICategoryBlMapper } from '../mappers/category.mapper';
import { CategoryDto } from '../../api/dto/out/category.dto';
import { CategoryServiceAdapterName, ICategoryServiceAdapter } from '../../db/adapter/category-service.adapter';
import { CreateCategoryDto } from '../../api/dto/in/create-category.dto';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Utils } from '../utils';

export interface ICategoryService {
    getCategories: () => Promise<CategoryDto[]>;
    getCategoryById: (id: string) => Promise<CategoryDto>;
    createCategory: (categoryDto: CreateCategoryDto) => Promise<CategoryDto>;
    updateCategory: (category: CategoryDto) => Promise<CategoryDto>;
    softRemoveCategory: (id: string) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
}

export const CategoryServiceName = Symbol('ICategoryService');

@Injectable({ scope: Scope.REQUEST })
export class CategoryService implements ICategoryService {
    constructor(
        @Inject(CategoryServiceAdapterName) private readonly _categoryAdapter: ICategoryServiceAdapter,
        @Inject(CategoryBlMapperName) private readonly _categoryMapper: ICategoryBlMapper,
    ) {}

    async getCategories(): Promise<CategoryDto[]> {
        const categories = await this._categoryAdapter.getCategories();

        return categories.map((x) => this._categoryMapper.mapToDtoFromCommand(x));
    }

    async getCategoryById(id: string): Promise<CategoryDto> {
        const { serviceResultType, data, exceptionMessage } = await this._categoryAdapter.getCategoryById(id);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return this._categoryMapper.mapToDtoFromCommand(data);
    }

    async createCategory(categoryDto: CreateCategoryDto): Promise<CategoryDto> {
        const category = this._categoryMapper.mapCreateToCommandFromDto(categoryDto);

        const createdCategory = await this._categoryAdapter.createCategory(category);

        return this._categoryMapper.mapToDtoFromCommand(createdCategory);
    }

    async updateCategory(category: CategoryDto): Promise<CategoryDto> {
        const categorySchema = this._categoryMapper.mapToCommandFromDto(category);

        const { serviceResultType, data, exceptionMessage } = await this._categoryAdapter.updateCategory(
            categorySchema,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return this._categoryMapper.mapToDtoFromCommand(data);
    }

    async softRemoveCategory(id: string): Promise<void> {
        const { serviceResultType, exceptionMessage } = await this._categoryAdapter.softRemoveCategory(id);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);
    }

    async removeCategory(id: string): Promise<void> {
        const { serviceResultType, exceptionMessage } = await this._categoryAdapter.removeCategory(id);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);
    }
}
