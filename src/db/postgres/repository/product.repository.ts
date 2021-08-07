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
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    ) {}

    async getProductById(id: string): Promise<ServiceResult<IBaseDb>> {
        const foundProduct = await this.productRepository.findOne(id);

        if (!foundProduct) {
            return new ServiceResult<Category>(ServiceResultType.NotFound);
        }

        return new ServiceResult<Category>(ServiceResultType.Success, foundProduct);
    }

    async createProduct(product: ICreateProductEntity): Promise<ServiceResult<IBaseDb>> {
        const existingCategory = await this.categoryRepository.findOne(product.categoryId);

        if (!existingCategory) {
            return new ServiceResult(ServiceResultType.InvalidData);
        }

        const newProductEntity = new Product();
        newProductEntity.price = product.price;
        newProductEntity.displayName = product.displayName;
        newProductEntity.category = existingCategory;

        const creationResult = await this.productRepository.save(newProductEntity);

        return new ServiceResult<Category>(ServiceResultType.Success, creationResult);
    }

    async updateProduct(product: IBaseDb): Promise<ServiceResult<IBaseDb>> {
        const id: string = (product as Product).id;
        const foundEntity = await this.productRepository.findOne(id);

        if (!foundEntity) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        const updateResult = await this.productRepository.update(
            { id },
            {
                ...product,
                createdAt: foundEntity.createdAt,
                isDeleted: foundEntity.isDeleted,
            },
        );

        if (!updateResult.affected) {
            return new ServiceResult(ServiceResultType.InternalError);
        }

        return new ServiceResult<Category>(ServiceResultType.Success, foundEntity);
    }

    async removeProduct(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this.productRepository.update({ id }, { isDeleted: true });

        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        const removeResult = await this.productRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
