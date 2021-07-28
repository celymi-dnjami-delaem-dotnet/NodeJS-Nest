import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schemas/categorySchema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepository {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

    async getCategoryById(id: string): Promise<Category> {
        return await this.categoryModel.findById(id).exec();
    }

    async createCategory(category: Category): Promise<Category> {
        const categorySchema = new this.categoryModel(category);

        return await categorySchema.save();
    }

    async updateRepository(category: Category): Promise<Category> {
        const updateResult = await this.categoryModel.updateOne(
            { _id: category._id },
            { $set: { displayName: category.displayName } },
        );

        if (updateResult.nModified) {
            return await this.categoryModel.findById(category._id).exec();
        }

        return null;
    }

    async softRemoveCategory(id: string): Promise<void> {
        await this.categoryModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
    }

    async removeCategory(id: string): Promise<void> {
        await this.categoryModel.findByIdAndRemove(id, { useFindAndModify: false }).exec();
    }
}
