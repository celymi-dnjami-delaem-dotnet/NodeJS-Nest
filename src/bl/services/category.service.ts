import { CategoryDto } from '../../api/dto/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryServiceAdapter } from '../../db/adapter/category-service.adapter';
import { CreateCategoryDto } from '../../api/dto/create-category.dto';
import { Injectable, Scope } from '@nestjs/common';
import { Utils } from '../utils';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
    constructor(
        private readonly _categoryAdapter: CategoryServiceAdapter,
        private readonly _categoryMapper: CategoryMapper,
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
