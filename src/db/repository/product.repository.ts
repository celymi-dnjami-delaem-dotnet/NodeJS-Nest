import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/productSchema';
import { Model } from 'mongoose';

@Injectable()
export class ProductRepository {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

    async getProductById(id: string): Promise<Product> {
        return this.productModel.findById(id).exec();
    }

    async createProduct(productEntity: Product): Promise<any> {
        const createdProduct = new this.productModel(productEntity);

        return await createdProduct.save();
    }
}
