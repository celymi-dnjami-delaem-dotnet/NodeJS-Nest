import { CreateProductDto } from '../../api/dto/actions/create-product.dto';
import { ICreateProductEntity } from '../../db/postgres/types/create-product.type';
import { ICreateProductSchema } from '../../db/mongo/types/create-product.type';
import { Injectable } from '@nestjs/common';
import { ProductDto } from '../../api/dto/models/product.dto';
import { Product as ProductEntity } from '../../db/postgres/entities/product.entity';
import { Product as ProductSchema } from '../../db/mongo/schemas/product.schema';

@Injectable()
export class ProductMapper {
    mapToSchemaFromDto(product: ProductDto): ProductSchema {
        return {
            _id: product.id,
            price: product.price,
            displayName: product.displayName,
            createdAt: product.createdAt,
            totalRating: product.totalRating,
            isDeleted: product.isDeleted,
        };
    }

    mapToEntityFromDto(product: ProductDto): ProductEntity {
        return {
            id: product.id,
            price: product.price,
            displayName: product.displayName,
            createdAt: product.createdAt,
            totalRating: product.totalRating,
            isDeleted: product.isDeleted,
        };
    }

    mapToDtoFromSchema(product: ProductSchema): ProductDto {
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

    mapToDtoFromEntity(product: ProductEntity): ProductDto {
        return {
            id: product.id,
            displayName: product.displayName,
            categoryId: product.category && product.category.id,
            price: product.price,
            totalRating: product.totalRating,
            createdAt: product.createdAt,
            isDeleted: product.isDeleted,
        };
    }

    mapToCreateSchemaFromCreateDto(product: CreateProductDto): ICreateProductSchema {
        return {
            displayName: product.displayName,
            category: product.categoryId,
            price: product.price,
        };
    }

    mapToCreateEntityFromCreateDto(product: CreateProductDto): ICreateProductEntity {
        return {
            displayName: product.displayName,
            categoryId: product.categoryId,
            price: product.price,
        };
    }
}
