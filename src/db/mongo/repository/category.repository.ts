import { Category, CategoryDocument } from '../schemas/category.schema';
import { IBaseDb } from '../../base-types/base-db.type';
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
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

    async getCategories(): Promise<IBaseDb[]> {
        return this.categoryModel.find().populate({ path: 'products', model: 'Product' }).exec();
    }

    async getCategoryById(id: string, search: ISearchParamsCategory): Promise<ServiceResult<Category>> {
        const category = await this.categoryModel
            .findOne({ _id: id })
            .lean()
            .populate(
                search.includeProducts
                    ? {
                          path: 'products',
                          model: 'Product',
                          options: { sort: { totalRating: 'DESC' }, limit: search.includeTopCategories },
                      }
                    : {},
            )
            .exec();

        if (!category) {
            return new ServiceResult<Category>(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult<Category>(ServiceResultType.Success, category);
    }

    async createCategory(category: ICreateCategoryDb): Promise<IBaseDb> {
        const categorySchema = new this.categoryModel(category);

        return await categorySchema.save();
    }

    async updateCategory(category: Category): Promise<ServiceResult<Category>> {
        const updateResult = await this.categoryModel
            .updateOne({ _id: category._id }, { $set: { displayName: category.displayName } })
            .exec();

        if (!updateResult.nModified) {
            return new ServiceResult<Category>(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        const updatedModel = await this.categoryModel.findById(category._id).lean().exec();

        return new ServiceResult<Category>(ServiceResultType.Success, updatedModel);
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.categoryModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
        if (!removeResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.categoryModel.deleteOne({ _id: id }).exec();
        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingCategoryEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
