import { Category } from '../entities/category.entity';
import { IBaseDb } from '../../types/base-db.type';
import { ICreateProductEntity } from '../types/create-product.type';
import { IProductRepository } from '../../types/product-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';

export class ProductTypeOrmRepository implements IProductRepository {
    private static readonly missingProductExceptionMessage: string =
        'Unable to perform this operation due to missing product by provided parameters';

    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    ) {}

    getProducts(): Promise<IBaseDb[]> {
        return this.productRepository.find();
    }

    async getProductById(id: string): Promise<ServiceResult<IBaseDb>> {
        const foundProduct = await this.findProductById(id, true);

        if (!foundProduct) {
            return new ServiceResult<Category>(
                ServiceResultType.NotFound,
                null,
                ProductTypeOrmRepository.missingProductExceptionMessage,
            );
        }

        return new ServiceResult<Category>(ServiceResultType.Success, foundProduct);
    }

    async createProduct(product: ICreateProductEntity): Promise<ServiceResult<IBaseDb>> {
        const existingCategory = await this.categoryRepository.findOne(product.categoryId);

        if (!existingCategory) {
            return new ServiceResult(ServiceResultType.InvalidData, null, 'No such category exists by provided id');
        }

        const newProductEntity = new Product();
        newProductEntity.price = product.price;
        newProductEntity.displayName = product.displayName;
        newProductEntity.category = existingCategory;

        const creationResult = await this.productRepository.save(newProductEntity);

        return new ServiceResult<Category>(ServiceResultType.Success, creationResult);
    }

    async updateProduct(product: Product): Promise<ServiceResult<IBaseDb>> {
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
            return new ServiceResult(
                ServiceResultType.NotFound,
                null,
                ProductTypeOrmRepository.missingProductExceptionMessage,
            );
        }

        const updatedEntity = await this.findProductById(id, true);

        return new ServiceResult<Category>(ServiceResultType.Success, updatedEntity);
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this.productRepository.update({ id }, { isDeleted: true });

        if (!softRemoveResult.affected) {
            return new ServiceResult(
                ServiceResultType.NotFound,
                null,
                ProductTypeOrmRepository.missingProductExceptionMessage,
            );
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this.productRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(
                ServiceResultType.NotFound,
                null,
                ProductTypeOrmRepository.missingProductExceptionMessage,
            );
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private async findProductById(id: string, includeChildren?: boolean): Promise<Category> {
        return this.productRepository.findOne(id, includeChildren ? { relations: ['category'] } : {});
    }
}
