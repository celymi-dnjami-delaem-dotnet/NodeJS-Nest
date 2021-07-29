import { Injectable, Scope } from '@nestjs/common';
import { ProductRepository } from '../../db/repository/product.repository';
import { ProductDto } from '../../api/dto/models/product.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { Utils } from '../utils';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
    constructor(private readonly productRepository: ProductRepository, private readonly productMapper: ProductMapper) {}

    async getProductById(id: string): Promise<ProductDto> {
        const { serviceResultType, data } = await this.productRepository.getProductById(id);

        Utils.validateServiceResultType(serviceResultType);

        return this.productMapper.mapToDto(data);
    }

    async createProduct(product: ProductDto): Promise<ProductDto> {
        const productSchema = this.productMapper.mapToSchema(product);

        const createdProduct = await this.productRepository.createProduct(productSchema);

        return this.productMapper.mapToDto(createdProduct);
    }

    async updateProduct(product: ProductDto): Promise<ProductDto> {
        const productSchema = this.productMapper.mapToSchema(product);

        const { serviceResultType, data } = await this.productRepository.updateProduct(productSchema);

        Utils.validateServiceResultType(serviceResultType);

        return this.productMapper.mapToDto(data);
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
