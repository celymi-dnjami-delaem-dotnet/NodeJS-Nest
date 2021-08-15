import { Category } from '../entities/category.entity';
import { IBaseDb } from '../../base-types/base-db.type';
import { ICategoryRepository } from '../../base-types/category-repository.type';
import { ICreateCategoryDb } from '../../base-types/create-category.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
    private static readonly missingCategoryExceptionMessage: string =
        'Unable to perform this operation due to missing category by provided parameters';

    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

    getCategories(): Promise<IBaseDb[]> {
        return this.categoryRepository.find();
    }

    async getCategoryById(id: string): Promise<ServiceResult<IBaseDb>> {
        const foundResult = await this.findCategoryById(id, true);

        if (!foundResult) {
            return new ServiceResult(
                ServiceResultType.NotFound,
                null,
                CategoryTypeOrmRepository.missingCategoryExceptionMessage,
            );
        }

        return new ServiceResult<IBaseDb>(ServiceResultType.Success, foundResult);
    }

    async createCategory(category: ICreateCategoryDb): Promise<IBaseDb> {
        return this.categoryRepository.save(category);
    }

    async updateCategory(category: Category): Promise<ServiceResult<IBaseDb>> {
        const id: string = category.id;

        const updateResult = await this.categoryRepository.update(
            { id },
            {
                displayName: category.displayName,
            },
        );

        if (!updateResult.affected) {
            return new ServiceResult(
                ServiceResultType.NotFound,
                null,
                CategoryTypeOrmRepository.missingCategoryExceptionMessage,
            );
        }

        const foundEntity = await this.findCategoryById(id);

        return new ServiceResult(ServiceResultType.Success, foundEntity);
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this.categoryRepository.update({ id }, { isDeleted: true });

        if (!softRemoveResult.affected) {
            return new ServiceResult(
                ServiceResultType.NotFound,
                null,
                CategoryTypeOrmRepository.missingCategoryExceptionMessage,
            );
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.categoryRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(
                ServiceResultType.NotFound,
                null,
                CategoryTypeOrmRepository.missingCategoryExceptionMessage,
            );
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private async findCategoryById(id: string, includeChildren?: boolean): Promise<Category> {
        return this.categoryRepository.findOne(id, includeChildren ? { relations: ['products'] } : {});
    }
}
