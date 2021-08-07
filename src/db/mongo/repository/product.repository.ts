import { Category, CategoryDocument } from '../schemas/category.schema';
import { IBaseDb } from '../../types/base-db.type';
import { ICreateProductSchema } from '../types/create-product.type';
import { IProductRepository } from '../../types/product-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';

@Injectable({ scope: Scope.REQUEST })
export class ProductMongooseRepository implements IProductRepository {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    ) {}

    async getProductById(id: string): Promise<ServiceResult<Product>> {
        const productSchema = await this.productModel
            .findOne({ _id: id })
            .populate('category', null, Category.name)
            .exec();

        if (!productSchema) {
            return new ServiceResult<Product>(ServiceResultType.NotFound);
        }

        return new ServiceResult<Product>(ServiceResultType.Success, productSchema);
    }

    async createProduct(product: ICreateProductSchema): Promise<ServiceResult<IBaseDb>> {
        const existingCategory = await this.categoryModel.findOne({ id: product.category });

        if (!existingCategory) {
            return new ServiceResult<Category>(ServiceResultType.InvalidData);
        }

        const createdProduct = new this.productModel(product);
        const creationResult = await createdProduct.save();

        const updateResult = await this.categoryModel
            .updateOne({ _id: existingCategory._id }, { $push: { products: existingCategory._id } })
            .exec();

        if (!updateResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult<Category>(ServiceResultType.Success, creationResult);
    }

    async updateProduct(productSchema: Product): Promise<ServiceResult<Product>> {
        const updateResult = await this.productModel
            .updateOne(
                { _id: productSchema._id },
                {
                    $set: { displayName: productSchema.displayName, price: productSchema.price },
                },
            )
            .exec();

        if (!updateResult.nModified) {
            return new ServiceResult<Product>(ServiceResultType.NotFound);
        }

        const updatedSchema = await this.productModel.findById(productSchema._id);

        return new ServiceResult<Product>(ServiceResultType.Success, updatedSchema);
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this.productModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
        if (removeResult.nModified) {
            return new ServiceResult(ServiceResultType.Success);
        }

        return new ServiceResult(ServiceResultType.NotFound);
    }

    async removeProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this.productModel.deleteOne({ _id: id }).exec();
        if (removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.Success);
        }

        return new ServiceResult(ServiceResultType.NotFound);
    }
}
