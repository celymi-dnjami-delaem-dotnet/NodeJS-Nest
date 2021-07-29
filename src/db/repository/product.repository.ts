import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { ServiceResult } from '../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';
import { Category } from '../schemas/category.schema';

@Injectable({ scope: Scope.REQUEST })
export class ProductRepository {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

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

    async createProduct(productEntity: Product): Promise<Product> {
        const createdProduct = new this.productModel(productEntity);

        return await createdProduct.save();
    }

    async updateProduct(productSchema: Product): Promise<ServiceResult<Product>> {
        const updateResult = await this.productModel.updateOne(
            { _id: productSchema._id },
            {
                $set: { displayName: productSchema.displayName, price: productSchema.price },
            },
        );

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
