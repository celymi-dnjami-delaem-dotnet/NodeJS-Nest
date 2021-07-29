import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Model } from 'mongoose';
import { ServiceResult } from '../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';
import { Product } from '../schemas/product.schema';

@Injectable({ scope: Scope.REQUEST })
export class CategoryRepository {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

    async getCategoryById(id: string): Promise<ServiceResult<Category>> {
        const category = await this.categoryModel.findOne({ _id: id }).populate('products', null, Product.name).exec();

        if (category) {
            return new ServiceResult<Category>(ServiceResultType.Success, category);
        }

        return new ServiceResult<Category>(ServiceResultType.NotFound);
    }

    async createCategory(category: Category): Promise<Category> {
        const categorySchema = new this.categoryModel(category);

        return await categorySchema.save();
    }

    async updateCategory(category: Category): Promise<ServiceResult<Category>> {
        const updateResult = await this.categoryModel.updateOne(
            { _id: category._id },
            { $set: { displayName: category.displayName } },
        );

        if (!updateResult.nModified) {
            return new ServiceResult<Category>(ServiceResultType.NotFound);
        }

        const updatedModel = await this.categoryModel.findById(category._id).exec();

        return new ServiceResult<Category>(ServiceResultType.Success, updatedModel);
    }

    async softRemoveCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.categoryModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();

        if (!removeResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeCategory(id: string): Promise<ServiceResult> {
        const removeResult = await this.categoryModel.deleteOne({ _id: id }).exec();

        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
