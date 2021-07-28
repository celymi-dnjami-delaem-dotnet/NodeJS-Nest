import { Injectable, Scope } from '@nestjs/common';
import { ProductRepository } from '../../db/repository/product.repository';
import { Product } from '../../db/schemas/productSchema';
import { ProductDto } from '../../api/dto/product.dto';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
    constructor(private readonly productRepository: ProductRepository, private readonly productMapper: ProductMapper) {}

    async getProductById(id: string): Promise<any> {
        const productSchema: Product = await this.productRepository.getProductById(id);

        return this.productMapper.mapToDto(productSchema);
    }

    async createProduct(product: ProductDto): Promise<any> {
        const productSchema: Product = this.productMapper.mapToSchema(product);

        return await this.productRepository.createProduct(productSchema);
    }
}
