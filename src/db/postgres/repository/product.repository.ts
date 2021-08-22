import { Category } from '../entities/category.entity';
import { FindConditions, FindManyOptions, LessThan, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { IBaseProduct } from '../../base-types/base-product.type';
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
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    ) {}

    getProducts(searchParams: ISearchParamsProduct): Promise<IBaseProduct[]> {
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

        return this.productRepository.find(searchOptions);
    }

    async getProductById(id: string): Promise<ServiceResult<IBaseProduct>> {
        const foundProduct = await this.findProductById(id, true);

        if (!foundProduct) {
            return new ServiceResult<IBaseProduct>(
                ServiceResultType.NotFound,
                null,
                missingProductEntityExceptionMessage,
            );
        }

        return new ServiceResult<IBaseProduct>(ServiceResultType.Success, foundProduct);
    }

    async createProduct(product: ICreateProductEntity): Promise<ServiceResult<IBaseProduct>> {
        const existingCategory = await this.categoryRepository.findOne(product.categoryId);

        if (!existingCategory) {
            return new ServiceResult(ServiceResultType.InvalidData, null, missingProductEntityExceptionMessage);
        }

        const newProductEntity = new Product();
        newProductEntity.price = product.price;
        newProductEntity.displayName = product.displayName;
        newProductEntity.category = existingCategory;

        const creationResult = await this.productRepository.save(newProductEntity);

        return new ServiceResult<IBaseProduct>(ServiceResultType.Success, creationResult);
    }

    async updateProduct(product: Product): Promise<ServiceResult<IBaseProduct>> {
        const id: string = product.id;

        const updateResult = await this.productRepository.update(
            { id },
            {
                displayName: product.displayName,
                price: product.price,
                totalRating: product.totalRating,
            },
        );

        if (!updateResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        const updatedEntity = await this.findProductById(id, true);

        return new ServiceResult<IBaseProduct>(ServiceResultType.Success, updatedEntity);
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this.productRepository.update({ id }, { isDeleted: true });

        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this.productRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingProductEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private async findProductById(id: string, includeChildren?: boolean): Promise<IBaseProduct> {
        return this.productRepository.findOne(id, includeChildren ? { relations: ['category'] } : {});
    }
}
