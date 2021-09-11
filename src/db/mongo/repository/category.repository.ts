import { Category, CategoryDocument } from '../schemas/category.schema';
import { IBaseCategory } from '../../base-types/base-category.type';
import { ICategoryRepository } from '../../base-types/category-repository.type';
import { ICreateCategoryDb } from '../../base-types/create-category.type';
import { ISearchParamsCategory } from '../../base-types/search-params-category.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { missingCategoryEntityExceptionMessage } from '../../constants';

@Injectable()
export class CategoryMongooseRepository implements ICategoryRepository {
    constructor(@InjectModel(Category.name) private readonly _categoryModel: Model<CategoryDocument>) {}

    async getCategories(limit: number, offset: number): Promise<IBaseCategory[]> {
        return this._categoryModel
            .find()
            .lean()
            .skip(offset)
            .limit(limit)
            .populate({
                path: 'products',
                model: 'Product',
            })
            .exec();
    }

    async getCategoryById(id: string, search: ISearchParamsCategory): Promise<ServiceResult<Category>> {
        const query = this._categoryModel.findOne({ _id: id });

        if (search.includeProducts) {
            query.populate({
                path: 'products',
                model: 'Product',
                options: { sort: { totalRating: 'DESC' }, limit: search.includeTopCategories },
            });
        }

        const category = await query.exec();

        if (!category) {
            return new ServiceResult<Category>(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult<Category>(ServiceResultType.Success, category);
    }

    async createCategory(category: ICreateCategoryDb): Promise<IBaseCategory> {
        const categorySchema = new this._categoryModel(category);

        return await categorySchema.save();
    }

    async updateCategory(category: Category): Promise<ServiceResult<Category>> {
        const updateResult = await this._categoryModel
            .updateOne({ _id: category._id }, { $set: { displayName: category.displayName } })
            .exec();

        if (!updateResult.nModified) {
            return new ServiceResult<Category>(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        const updatedModel = await this._categoryModel.findById(category._id).lean().exec();

        return new ServiceResult<Category>(ServiceResultType.Success, updatedModel);
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this._categoryModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();

        if (!removeResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this._categoryModel.deleteOne({ _id: id }).exec();

        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeAllCategories(): Promise<ServiceResult> {
        const removeResult = await this._categoryModel.deleteMany().exec();

        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
