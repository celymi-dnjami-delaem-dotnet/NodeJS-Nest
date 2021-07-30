import { CategoryDto } from '../../api/dto/models/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryRepository } from '../../db/repository/category.repository';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { Injectable, Scope } from '@nestjs/common';
import { Utils } from '../utils';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly categoryMapper: CategoryMapper,
    ) {}

    async getCategoryById(id: string): Promise<CategoryDto> {
        const { serviceResultType, data } = await this.categoryRepository.getCategoryById(id);

        Utils.validateServiceResultType(serviceResultType);

        return this.categoryMapper.mapToDtoModel(data);
    }

    async createCategory(category: CreateCategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryMapper.mapToCreateSchema(category);

        const createdCategorySchema = await this.categoryRepository.createCategory(categorySchema);

        return this.categoryMapper.mapToDtoModel(createdCategorySchema);
    }

    async updateCategory(category: CategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryMapper.mapToSchema(category);

        const { serviceResultType, data } = await this.categoryRepository.updateCategory(categorySchema);

        Utils.validateServiceResultType(serviceResultType);

        return this.categoryMapper.mapToDtoModel(data);
    }

    async softRemoveCategory(id: string): Promise<void> {
        const { serviceResultType } = await this.categoryRepository.softRemoveCategory(id);

        Utils.validateServiceResultType(serviceResultType);
    }

    async removeCategory(id: string): Promise<void> {
        const { serviceResultType } = await this.categoryRepository.removeCategory(id);

        Utils.validateServiceResultType(serviceResultType);
    }
}
