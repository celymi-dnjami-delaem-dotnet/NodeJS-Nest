import { Category } from '../entities/category.entity';
import { IBaseDb } from '../../types/base-db.type';
import { ICategoryRepository } from '../../types/category-repository.type';
import { ICreateCategory } from '../../types/create-category.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';

export class CategoryTypeOrmRepository implements ICategoryRepository {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

    async getCategoryById(id: string): Promise<ServiceResult<IBaseDb>> {
        const foundResult = await this.categoryRepository.findOne(id, { relations: ['products'] });

        if (!foundResult) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult<IBaseDb>(ServiceResultType.Success, foundResult);
    }

    async createCategory(category: ICreateCategory): Promise<IBaseDb> {
        return this.categoryRepository.save(category);
    }

    async updateCategory(category: IBaseDb): Promise<ServiceResult<IBaseDb>> {
        const id: string = (category as Category).id;
        const foundEntity = await this.categoryRepository.findOne(id);

        if (!foundEntity) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        const updateResult = await this.categoryRepository.update(
            { id },
            {
                ...category,
                createdAt: foundEntity.createdAt,
                isDeleted: foundEntity.isDeleted,
            },
        );

        if (!updateResult.affected) {
            return new ServiceResult(ServiceResultType.InternalError);
        }

        return new ServiceResult(ServiceResultType.Success, foundEntity);
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this.categoryRepository.update({ id }, { isDeleted: true });

        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.categoryRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
