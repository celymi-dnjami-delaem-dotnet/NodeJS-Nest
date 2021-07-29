import { Injectable, Scope } from '@nestjs/common';
import { CategoryRepository } from '../../db/repository/category.repository';
import { CategoryDto } from '../../api/dto/models/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { ServiceResultType } from '../result-wrappers/service-result-type';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly categoryMapper: CategoryMapper,
    ) {}

    async getCategoryById(id: string): Promise<CategoryDto> {
        const { serviceResultType, data } = await this.categoryRepository.getCategoryById(id);

        if (serviceResultType === ServiceResultType.NotFound) {
            throw new Error();
        }

        return this.categoryMapper.mapToDtoModel(data);
    }

    async createCategory(category: CreateCategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryMapper.mapToSchemaCreateDto(category);

        const createdCategorySchema = await this.categoryRepository.createCategory(categorySchema);

        return this.categoryMapper.mapToDtoModel(createdCategorySchema);
    }

    async updateCategory(category: CategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryMapper.mapToSchema(category);

        const { serviceResultType, data } = await this.categoryRepository.updateCategory(categorySchema);
        if (serviceResultType === ServiceResultType.NotFound) {
            throw new Error();
        }

        return this.categoryMapper.mapToDtoModel(data);
    }

    async softRemoveCategory(id: string): Promise<void> {
        const { serviceResultType } = await this.categoryRepository.softRemoveCategory(id);

        if (serviceResultType === ServiceResultType.NotFound) {
            throw new Error();
        }
    }

    async removeCategory(id: string): Promise<void> {
        const { serviceResultType } = await this.categoryRepository.removeCategory(id);

        if (serviceResultType === ServiceResultType.NotFound) {
            throw new Error();
        }
    }
}
