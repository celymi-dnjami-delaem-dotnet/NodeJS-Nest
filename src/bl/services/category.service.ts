import { Injectable, Scope } from '@nestjs/common';
import { CategoryRepository } from '../../db/repository/category.repository';
import { CategoryDto } from '../../api/dto/category.dto';
import { Category } from '../../db/schemas/categorySchema';
import { CategoryMapper } from '../mappers/category.mapper';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly categoryMapper: CategoryMapper,
    ) {}

    async getCategoryById(id: string): Promise<CategoryDto> {
        const category: Category = await this.categoryRepository.getCategoryById(id);

        return this.categoryMapper.mapToDtoModel(category);
    }

    async createCategory(category: CreateCategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryMapper.mapToSchemaCreateDto(category);

        const createdCategorySchema = await this.categoryRepository.createCategory(categorySchema);

        return this.categoryMapper.mapToDtoModel(createdCategorySchema);
    }

    async updateCategory(category: CategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryMapper.mapToSchema(category);

        const updatedCategorySchema = await this.categoryRepository.updateRepository(categorySchema);

        return this.categoryMapper.mapToDtoModel(updatedCategorySchema);
    }

    async softRemoveCategory(id: string): Promise<void> {
        await this.categoryRepository.softRemoveCategory(id);
    }

    async removeCategory(id: string): Promise<void> {
        await this.categoryRepository.removeCategory(id);
    }
}
