import { Product } from '../../db/schemas/productSchema';
import { ProductDto } from '../../api/dto/product.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductMapper {
    mapToSchema(product: ProductDto): Product {
        return {
            _id: product.id,
            price: product.price,
            displayName: product.displayName,
            createdAt: product.createdAt,
            totalRating: product.totalRating,
            isDeleted: product.isDeleted,
        };
    }

    mapToDto(product: Product): ProductDto {
        return {
            id: product._id,
            displayName: product.displayName,
            categoryId: product.category._id,
            price: product.price,
            totalRating: product.totalRating,
            createdAt: product.createdAt,
            isDeleted: product.isDeleted,
        };
    }
}
