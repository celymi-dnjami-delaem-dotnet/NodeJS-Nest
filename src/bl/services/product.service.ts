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
        private readonly productAdapter: ProductAdapter,
    ) {}

    async getProducts(): Promise<ProductDto[]> {
        const products = await this.productRepository.getProducts();

        return products.map((x) => this.productAdapter.adaptFromDbToDto(x));
    }

    async getProductById(id: string): Promise<ProductDto> {
        const { serviceResultType, data } = await this.productRepository.getProductById(id);

        Utils.validateServiceResultType(serviceResultType);

        return this.productAdapter.adaptFromDbToDto(data);
    }

    async createProduct(product: CreateProductDto): Promise<ProductDto> {
        const dbProduct = this.productAdapter.adaptCreateFromDtoToDb(product);

        const { serviceResultType, data, exceptionMessage } = await this.productRepository.createProduct(dbProduct);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return this.productAdapter.adaptFromDbToDto(data);
    }

    async updateProduct(product: ProductDto): Promise<ProductDto> {
        const productSchema = this.productAdapter.adaptFromDtoToDb(product);

        const { serviceResultType, data } = await this.productRepository.updateProduct(productSchema);

        Utils.validateServiceResultType(serviceResultType);

        return this.productAdapter.adaptFromDbToDto(data);
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
