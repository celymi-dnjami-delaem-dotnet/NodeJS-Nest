import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { ServiceResult } from '../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';

@Injectable({ scope: Scope.REQUEST })
export class ProductRepository {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

    async getProductById(id: string): Promise<Product> {
        return this.productModel.findById(id).exec();
    }

    async createProduct(productEntity: Product): Promise<Product> {
        const createdProduct = new this.productModel(productEntity);

        return await createdProduct.save();
    }

    async updateProduct(productEntity: Product): Promise<Product> {
        return null;
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        const updateResult = await this.productModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
        if (updateResult.nModified) {
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
