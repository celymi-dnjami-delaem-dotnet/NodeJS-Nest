import { CategoryRepositoryName, ICategoryRepository } from '../../db/types/category-repository.type';
import { CreateProductDto } from '../../api/dto/actions/create-product.dto';
import { IProductRepository, ProductRepositoryName } from '../../db/types/product-repository.type';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProductAdapter } from '../adapters/product.adapter';
import { ProductDto } from '../../api/dto/models/product.dto';
import { Utils } from '../utils';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
    constructor(
        @Inject(CategoryRepositoryName) private readonly categoryRepository: ICategoryRepository,
        @Inject(ProductRepositoryName) private readonly productRepository: IProductRepository,
        private readonly productAdapted: ProductAdapter,
    ) {}

    async getProductById(id: string): Promise<ProductDto> {
        const { serviceResultType, data } = await this.productRepository.getProductById(id);

        Utils.validateServiceResultType(serviceResultType);

        return this.productAdapted.adaptFromDbToDto(data);
    }

    async createProduct(product: CreateProductDto): Promise<ProductDto> {
        const productSchema = this.productAdapted.adaptFromDtoToDb(product as any);

        const createdProduct = await this.productRepository.createProduct(productSchema);
        const { serviceResultType, exceptionMessage } = await this.categoryRepository.addProductToCategory(
            (productSchema as any).category,
            (createdProduct as any)._id,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return this.productAdapted.adaptFromDbToDto(createdProduct);
    }

    async updateProduct(product: ProductDto): Promise<ProductDto> {
        const productSchema = this.productAdapted.adaptFromDtoToDb(product);

        const { serviceResultType, data } = await this.productRepository.updateProduct(productSchema);

        Utils.validateServiceResultType(serviceResultType);

        return this.productAdapted.adaptFromDbToDto(data);
    }

    async softRemoveProduct(id: string): Promise<void> {
        const { serviceResultType } = await this.productRepository.softRemoveProduct(id);

        Utils.validateServiceResultType(serviceResultType);
    }

    async removeProduct(id: string): Promise<void> {
        const { serviceResultType } = await this.productRepository.removeProduct(id);

        Utils.validateServiceResultType(serviceResultType);
    }
}
