import { Category } from '../entities/category.entity';
import { IBaseCategory } from '../../base-types/base-category.type';
import { ICategoryRepository } from '../../base-types/category-repository.type';
import { ICreateCategoryDb } from '../../base-types/create-category.type';
import { ISearchParamsCategory } from '../../base-types/search-params-category.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { missingCategoryEntityExceptionMessage } from '../../constants';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

    async getCategories(limit: number, offset: number): Promise<Category[]> {
        return this.categoryRepository.find({ take: limit, skip: offset });
    }

    async getCategoryById(id: string, searchParams: ISearchParamsCategory): Promise<ServiceResult<Category>> {
        const foundResult = await this.categoryRepository
            .createQueryBuilder('category')
            .innerJoinAndSelect('category.products', 'product')
            .orderBy('product.totalRating', 'DESC')
            .limit(searchParams.includeTopCategories)
            .getOne();

        if (!foundResult) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult<Category>(ServiceResultType.Success, foundResult);
    }

    async createCategory(category: ICreateCategoryDb): Promise<IBaseCategory> {
        return this.categoryRepository.save(category);
    }

    async updateCategory(category: Category): Promise<ServiceResult<IBaseCategory>> {
        const id: string = category.id;

        const updateResult = await this.categoryRepository.update(
            { id },
            {
                displayName: category.displayName,
            },
        );

        if (!updateResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        const foundEntity = await this.categoryRepository.findOne(id);

        return new ServiceResult<Category>(ServiceResultType.Success, foundEntity);
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this.categoryRepository.update({ id }, { isDeleted: true });
        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.categoryRepository.delete(id);
        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
