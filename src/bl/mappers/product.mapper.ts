import { Product } from '../../db/schemas/product.schema';
import { ProductDto } from '../../api/dto/models/product.dto';
import { Injectable } from '@nestjs/common';
import { CreateProductSchema } from '../../db/schemas/create-product.schema';
import { CreateProductDto } from '../../api/dto/actions/create-product.dto';

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
            categoryId: product.category && product.category._id,
            price: product.price,
            totalRating: product.totalRating,
            createdAt: product.createdAt,
            isDeleted: product.isDeleted,
        };
    }

    mapToCreateSchema(product: CreateProductDto): CreateProductSchema {
        return {
            displayName: product.displayName,
            category: product.categoryId,
            price: product.price,
        };
    }
}
