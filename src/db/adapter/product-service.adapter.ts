import { ICreateProductCommand } from '../../bl/commands/create-product.command';
import { IProductCommand } from '../../bl/commands/product.command';
import { IProductDbMapper, ProductDbMapperName } from '../mappers/types/product-mapper.type';
import { IProductRepository, ProductRepositoryName } from '../base-types/product-repository.type';
import { ISearchParamsProductCommand } from '../../bl/commands/search-params-product.command';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IProductServiceAdapter {
    getProducts: (searchParams: ISearchParamsProductCommand) => Promise<IProductCommand[]>;
    getProductById: (id: string) => Promise<ServiceResult<IProductCommand>>;
    createProduct: (createProductCommand: ICreateProductCommand) => Promise<ServiceResult<IProductCommand>>;
    updateProduct: (productCommand: IProductCommand) => Promise<ServiceResult<IProductCommand>>;
    softRemoveProduct: (id: string) => Promise<ServiceResult>;
    removeProduct: (id: string) => Promise<ServiceResult>;
}

export const ProductServiceAdapterName = Symbol('IProductServiceAdapter');

@Injectable()
export class ProductServiceAdapter implements IProductServiceAdapter {
    constructor(
        @Inject(ProductRepositoryName) private readonly _productRepository: IProductRepository,
        @Inject(ProductDbMapperName) private readonly _productMapper: IProductDbMapper,
    ) {}

    async getProducts(searchParams: ISearchParamsProductCommand): Promise<IProductCommand[]> {
        const dbSearchParams = this._productMapper.mapSearchParamsToDbFromCommand(searchParams);

        const products = await this._productRepository.getProducts(dbSearchParams);

        return products.map(this._productMapper.mapToCommandFromDb);
    }

    async getProductById(id: string): Promise<ServiceResult<IProductCommand>> {
        const { serviceResultType, exceptionMessage, data } = await this._productRepository.getProductById(id);

        return new ServiceResult<IProductCommand>(
            serviceResultType,
            data && this._productMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async createProduct(createProductCommand: ICreateProductCommand): Promise<ServiceResult<IProductCommand>> {
        const createProductDb = await this._productMapper.mapCreateToDbFromCommand(createProductCommand);

        const { serviceResultType, data, exceptionMessage } = await this._productRepository.createProduct(
            createProductDb,
        );

        return new ServiceResult<IProductCommand>(
            serviceResultType,
            data && this._productMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async updateProduct(productCommand: IProductCommand): Promise<ServiceResult<IProductCommand>> {
        const updateProductDb = await this._productMapper.mapToDbFromCommand(productCommand);

        const { serviceResultType, exceptionMessage, data } = await this._productRepository.updateProduct(
            updateProductDb,
        );

        return new ServiceResult<IProductCommand>(
            serviceResultType,
            data && this._productMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async softRemoveProduct(id: string): Promise<ServiceResult> {
        return this._productRepository.softRemoveProduct(id);
    }

    async removeProduct(id: string): Promise<ServiceResult> {
        return this._productRepository.removeProduct(id);
    }
}
