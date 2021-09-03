import { CreateProductDto } from '../../api/dto/create-product.dto';
import { IProductServiceAdapter, ProductServiceAdapterName } from '../../db/adapter/product-service.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { ProductDto } from '../../api/dto/product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductUtils } from '../utils/product.utils';
import { Utils } from '../utils';

@Injectable()
export class ProductService {
    constructor(@Inject(ProductServiceAdapterName) private readonly _productServiceAdapter: IProductServiceAdapter) {}

    async getProducts(
        displayName?: string,
        minRating?: string,
        sortBy?: string,
        price?: string,
        limit?: string,
        offset?: string,
    ): Promise<ProductDto[]> {
        const searchParams = ProductUtils.getSearchParams(displayName, minRating, sortBy, price, limit, offset);

        const products = await this._productServiceAdapter.getProducts(searchParams);

        return products.map(ProductMapper.mapToDtoFromCommand);
    }

    async getProductById(id: string): Promise<ProductDto> {
        const { serviceResultType, data } = await this._productServiceAdapter.getProductById(id);

        Utils.validateServiceResultType(serviceResultType);

        return ProductMapper.mapToDtoFromCommand(data);
    }

    async createProduct(productDto: CreateProductDto): Promise<ProductDto> {
        const dbProduct = ProductMapper.mapCreateToCommandFromDto(productDto);

        const { serviceResultType, data, exceptionMessage } = await this._productServiceAdapter.createProduct(
            dbProduct,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return ProductMapper.mapToDtoFromCommand(data);
    }

    async updateProduct(productDto: ProductDto): Promise<ProductDto> {
        const productSchema = ProductMapper.mapToCommandFromDto(productDto);

        const { serviceResultType, data } = await this._productServiceAdapter.updateProduct(productSchema);

        Utils.validateServiceResultType(serviceResultType);

        return ProductMapper.mapToDtoFromCommand(data);
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
