import { CategoryDto } from '../../api/dto/models/category.dto';
import { CategoryMapperName, ICategoryMapper } from '../mappers/category.mapper';
import { CategoryServiceAdapterName, ICategoryServiceAdapter } from '../../db/adapter/category-service.adapter';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Utils } from '../utils';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
    constructor(
        @Inject(CategoryServiceAdapterName) private readonly _categoryAdapter: ICategoryServiceAdapter,
        @Inject(CategoryMapperName) private readonly _categoryMapper: ICategoryMapper,
    ) {}

    async getCategories(): Promise<CategoryDto[]> {
        const categories = await this._categoryAdapter.getCategories();

        return categories.map(this._categoryMapper.mapToDtoFromCommand);
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
