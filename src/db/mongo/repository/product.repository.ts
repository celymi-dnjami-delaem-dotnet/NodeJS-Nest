import { Category, CategoryDocument } from '../schemas/category.schema';
import { IBaseProduct } from '../../base-types/base-product.type';
import { ICreateProductSchema } from '../types/create-product.type';
import { IProductRepository } from '../../base-types/product-repository.type';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { missingProductEntityExceptionMessage } from '../../constants';

@Injectable()
export class ProductMongooseRepository implements IProductRepository {
    constructor(
        @InjectModel(Product.name) private readonly _productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private readonly _categoryModel: Model<CategoryDocument>,
    ) {}

    async getProducts(searchParams: ISearchParamsProduct): Promise<IBaseProduct[]> {
        const search = this._productModel.find();

        if (searchParams.displayName) {
            search.where('displayName').regex(searchParams.displayName);
        }

        if (searchParams.minRating) {
            search.where('totalRating').gte(searchParams.minRating);
        }

        if (searchParams.minPrice) {
            search.where('price').gt(searchParams.minPrice);
        }

        if (searchParams.maxPrice) {
            search.where('price').lt(searchParams.maxPrice);
        }

        return search
            .lean()
            .limit(searchParams.limit)
            .skip(searchParams.offset)
            .sort({ [searchParams.sortField]: searchParams.sortDirection })
            .exec();
    }

    async getProductById(id: string): Promise<ServiceResult<Product>> {
        const productSchema = await this.getProductWithChildren(id, true);

        if (!productSchema) {
            return new ServiceResult<Product>(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult<Product>(ServiceResultType.Success, productSchema);
    }

    async createProduct(product: ICreateProductSchema): Promise<ServiceResult<IBaseProduct>> {
        const existingCategory = await this._categoryModel.findOne({ _id: product.category }).exec();

        if (!existingCategory) {
            return new ServiceResult<IBaseProduct>(ServiceResultType.InvalidData);
        }

        const createdProduct = new this._productModel(product);
        const creationResult = await createdProduct.save();

        const updateResult = await this._categoryModel
            .updateOne({ _id: existingCategory._id }, { $push: { products: creationResult._id } })
            .exec();

        if (!updateResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult<IBaseProduct>(ServiceResultType.Success, creationResult);
    }

    async updateProduct(productSchema: Product): Promise<ServiceResult<Product>> {
        const updateResult = await this._productModel
            .updateOne(
                { _id: productSchema._id },
                {
                    $set: { displayName: productSchema.displayName, price: productSchema.price },
                },
            )
            .exec();

        if (!updateResult.nModified) {
            return new ServiceResult<Product>(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        const updatedSchema = await this.getProductWithChildren(productSchema._id, true);

        return new ServiceResult<Product>(ServiceResultType.Success, updatedSchema);
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this._productModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();

        if (!removeResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this._productModel.deleteOne({ _id: id }).exec();

        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeAllProducts(): Promise<ServiceResult> {
        const removeResult = await this._productModel.deleteMany().exec();

        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private async getProductWithChildren(id: string, includeChildren?: boolean): Promise<Product> {
        const query = this._productModel.findOne({ _id: id });

        if (includeChildren) {
            query.populate('category', null, Category.name);
        }

        return query.exec();
    }
}
