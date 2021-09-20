import { Category } from '../entities/category.entity';
import { FindConditions, FindManyOptions, LessThan, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ICreateProductEntity } from '../types/create-product.type';
import { IProductRepository } from '../../base-types/product-repository.type';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { missingProductEntityExceptionMessage } from '../../constants';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
    constructor(
        @InjectRepository(Product) private readonly _productRepository: Repository<Product>,
        @InjectRepository(Category) private readonly _categoryRepository: Repository<Category>,
    ) {}

    getProducts(searchParams: ISearchParamsProduct): Promise<Product[]> {
        let searchOptions: FindManyOptions = {
            order: { [searchParams.sortField]: searchParams.sortDirection.toUpperCase() as 'ASC' | 'DESC' | 1 | -1 },
            skip: searchParams.offset,
            take: searchParams.limit,
        };

        if (searchParams.displayName) {
            searchOptions = {
                ...searchOptions,
                where: {
                    ...(searchOptions.where as FindConditions<Product>),
                    displayName: Like(`%${searchParams.displayName}%`),
                },
            };
        }

        if (searchParams.minRating) {
            searchOptions = {
                ...searchOptions,
                where: {
                    ...(searchOptions.where as FindConditions<Product>),
                    totalRating: MoreThanOrEqual(searchParams.minRating),
                },
            };
        }

        if (searchParams.minPrice) {
            searchOptions = {
                ...searchOptions,
                where: { ...(searchOptions.where as FindConditions<Product>), price: MoreThan(searchParams.maxPrice) },
            };
        }

        if (searchParams.maxPrice) {
            searchOptions = {
                ...searchOptions,
                where: { ...(searchOptions.where as FindConditions<Product>), price: LessThan(searchParams.maxPrice) },
            };
        }

        return this._productRepository.find(searchOptions);
    }

    async getProductById(id: string): Promise<ServiceResult<Product>> {
        const foundProduct = await this.findProductById(id, true);

        if (!foundProduct) {
            return new ServiceResult<Product>(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult<Product>(ServiceResultType.Success, foundProduct);
    }

    async createProduct(product: ICreateProductEntity): Promise<ServiceResult<Product>> {
        let existingCategory: Category;
        if (product.categoryId) {
            existingCategory = await this._categoryRepository.findOne(product.categoryId);

            if (!existingCategory) {
                return new ServiceResult(ServiceResultType.InvalidData, null, missingProductEntityExceptionMessage);
            }
        }

        const newProductEntity = new Product();
        newProductEntity.price = product.price;
        newProductEntity.displayName = product.displayName;

        if (existingCategory) {
            newProductEntity.category = existingCategory;
        }

        const creationResult = await this._productRepository.save(newProductEntity);

        return new ServiceResult<Product>(ServiceResultType.Success, creationResult);
    }

    async updateProduct(product: Product): Promise<ServiceResult<Product>> {
        const id: string = product.id;

        const updateResult = await this._productRepository.update(
            { id },
            {
                displayName: product.displayName,
                price: product.price,
            },
        );

        if (!updateResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return this.getProductById(id);
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this._productRepository.update({ id }, { isDeleted: true });

        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this._productRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeAllProducts(): Promise<ServiceResult> {
        const removeResult = await this._productRepository.createQueryBuilder().delete().from(Product).execute();

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private async findProductById(id: string, includeChildren?: boolean): Promise<Product> {
        return this._productRepository.findOne(id, includeChildren ? { relations: ['category'] } : {});
    }
}
