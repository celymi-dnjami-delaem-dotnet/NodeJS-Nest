import { CategoryAdapter } from '../adapters/category.adapter';
import { CategoryDto } from '../../api/dto/models/category.dto';
import { CategoryRepositoryName, ICategoryRepository } from '../../db/types/category-repository.type';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Utils } from '../utils';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
    constructor(
        @Inject(CategoryRepositoryName) private readonly categoryRepository: ICategoryRepository,
        private readonly categoryAdapter: CategoryAdapter,
    ) {}

    async getCategoryById(id: string): Promise<CategoryDto> {
        const { serviceResultType, data } = await this.categoryRepository.getCategoryById(id);

        Utils.validateServiceResultType(serviceResultType);

        return this.categoryAdapter.adaptFromDbToDto(data);
    }

    async createCategory(category: CreateCategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryAdapter.adaptCreateFromDtoToDb(category);

        const createdCategorySchema = await this.categoryRepository.createCategory(categorySchema);

        return this.categoryAdapter.adaptFromDbToDto(createdCategorySchema);
    }

    async updateCategory(category: CategoryDto): Promise<CategoryDto> {
        const categorySchema = this.categoryAdapter.adaptFromDtoToDb(category);

        const { serviceResultType, data } = await this.categoryRepository.updateCategory(categorySchema);

        Utils.validateServiceResultType(serviceResultType);

        return this.categoryAdapter.adaptFromDbToDto(data);
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
