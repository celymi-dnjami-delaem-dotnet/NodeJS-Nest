import { CreateProductDto } from '../../api/dto/create-product.dto';
import { Injectable, Scope } from '@nestjs/common';
import { ProductDto } from '../../api/dto/product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductServiceAdapter } from '../../db/adapter/product-service.adapter';
import { Utils } from '../utils';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
    constructor(
        private readonly _productServiceAdapter: ProductServiceAdapter,
        private readonly _productMapper: ProductMapper,
    ) {}

    async getProducts(): Promise<ProductDto[]> {
        const products = await this._productServiceAdapter.getProducts();

        return products.map(this._productMapper.mapToDtoFromCommand);
    }

    async getProductById(id: string): Promise<ProductDto> {
        const { serviceResultType, data } = await this._productServiceAdapter.getProductById(id);

        Utils.validateServiceResultType(serviceResultType);

        return this._productMapper.mapToDtoFromCommand(data);
    }

    async createProduct(product: CreateProductDto): Promise<ProductDto> {
        const dbProduct = this._productMapper.mapCreateToCommandFromDto(product);

        const { serviceResultType, data, exceptionMessage } = await this._productServiceAdapter.createProduct(
            dbProduct,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return this._productMapper.mapToDtoFromCommand(data);
    }

    async updateProduct(product: ProductDto): Promise<ProductDto> {
        const productSchema = this._productMapper.mapToCommandFromDto(product);

        const { serviceResultType, data } = await this._productServiceAdapter.updateProduct(productSchema);

        Utils.validateServiceResultType(serviceResultType);

        return this._productMapper.mapToDtoFromCommand(data);
    }

    async softRemoveProduct(id: string): Promise<void> {
        const { serviceResultType } = await this._productServiceAdapter.softRemoveProduct(id);

        Utils.validateServiceResultType(serviceResultType);
    }

    async removeProduct(id: string): Promise<void> {
        const { serviceResultType } = await this._productServiceAdapter.removeProduct(id);

        Utils.validateServiceResultType(serviceResultType);
    }
}
