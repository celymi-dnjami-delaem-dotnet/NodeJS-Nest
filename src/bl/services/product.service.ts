import { CreateProductDto } from '../../api/dto/in/create-product.dto';
import { IProductBlMapper, ProductBlMapperName } from '../mappers/product.mapper';
import { IProductServiceAdapter, ProductServiceAdapterName } from '../../db/adapter/product-service.adapter';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProductDto } from '../../api/dto/out/product.dto';
import { ProductUtils } from '../utils/product.utils';
import { Utils } from '../utils';

export interface IProductService {
    getProducts: (
        displayName: string,
        minRating: string,
        sortBy: string,
        price: string,
        limit: string,
        offset: string,
    ) => Promise<ProductDto[]>;
    getProductById: (id: string) => Promise<ProductDto>;
    createProduct: (product: CreateProductDto) => Promise<ProductDto>;
    updateProduct: (product: ProductDto) => Promise<ProductDto>;
    softRemoveProduct: (id: string) => Promise<void>;
    removeProduct: (id: string) => Promise<void>;
}

export const ProductServiceName = Symbol('IProductService');

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements IProductService {
    constructor(
        @Inject(ProductServiceAdapterName) private readonly _productServiceAdapter: IProductServiceAdapter,
        @Inject(ProductBlMapperName) private readonly _productMapper: IProductBlMapper,
    ) {}

    async getProducts(
        displayName: string,
        minRating: string,
        sortBy: string,
        price: string,
        limit: string,
        offset: string,
    ): Promise<ProductDto[]> {
        const searchParams = ProductUtils.getSearchParams(displayName, minRating, sortBy, price, limit, offset);

        const products = await this._productServiceAdapter.getProducts(searchParams);

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
