import { Category } from '../entities/category.entity';
import { IBaseDb } from '../../types/base-db.type';
import { ICategoryRepository } from '../../types/category-repository.type';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';

export class CategoryTypeOrmRepository extends Repository<Category> implements ICategoryRepository {
    async getCategoryById(id: string): Promise<ServiceResult<IBaseDb>> {
        const foundResult = await this.findOne(id);

        return foundResult
            ? new ServiceResult<IBaseDb>(ServiceResultType.Success, foundResult)
            : new ServiceResult(ServiceResultType.NotFound);
    }

    async createCategory(category: IBaseDb): Promise<IBaseDb> {
        return this.create(category);
    }

    async updateCategory(category: IBaseDb): Promise<ServiceResult<IBaseDb>> {
        return Promise.resolve(undefined);
    }

    async addProductToCategory(categoryId: string, productId: string): Promise<ServiceResult<IBaseDb>> {
        return null;
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
