import { CategoryDto } from '../../api/dto/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryServiceAdapterName, ICategoryServiceAdapter } from '../../db/adapter/category-service.adapter';
import { CategoryUtils } from '../utils/category.utils';
import { CreateCategoryDto } from '../../api/dto/create-category.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '../utils';

@Injectable()
export class CategoryService {
    constructor(@Inject(CategoryServiceAdapterName) private readonly _categoryAdapter: ICategoryServiceAdapter) {}

    async getCategories(limit?: string, offset?: string): Promise<CategoryDto[]> {
        const categories = await this._categoryAdapter.getCategories(
            Utils.getCollectionSearchParameters(limit, offset),
        );

        return categories.map(CategoryMapper.mapToDtoFromCommand);
    }

    async getCategoryById(id: string, includeProducts?: string, includeTopProducts?: string): Promise<CategoryDto> {
        const searchParams = CategoryUtils.getSearchParamsForCategory(includeProducts, includeTopProducts);

        const { serviceResultType, data, exceptionMessage } = await this._categoryAdapter.getCategoryById(
            id,
            searchParams,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return CategoryMapper.mapToDtoFromCommand(data);
    }

    async createCategory(categoryDto: CreateCategoryDto): Promise<CategoryDto> {
        const category = CategoryMapper.mapCreateToCommandFromDto(categoryDto);

        const createdCategory = await this._categoryAdapter.createCategory(category);

        return CategoryMapper.mapToDtoFromCommand(createdCategory);
    }

    async updateCategory(categoryDto: CategoryDto): Promise<CategoryDto> {
        const categorySchema = CategoryMapper.mapToCommandFromDto(categoryDto);

        const { serviceResultType, data, exceptionMessage } = await this._categoryAdapter.updateCategory(
            categorySchema,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return CategoryMapper.mapToDtoFromCommand(data);
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
