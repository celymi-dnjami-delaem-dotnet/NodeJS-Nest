import { CategoryDto } from '../../api/dto/models/category.dto';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { CreateCategorySchema } from '../../db/mongo/schemas/create-category.schema';
import { Category as EntityCategory } from '../../db/postgres/entities/category.entity';
import { Injectable } from '@nestjs/common';
import { ProductMapper } from './product.mapper';
import { Category as SchemaCategory } from '../../db/mongo/schemas/category.schema';

@Injectable()
export class CategoryMapper {
    constructor(private readonly productMapper: ProductMapper) {}

    mapToDtoFromSchema(category: SchemaCategory): CategoryDto {
        return {
            id: category._id,
            displayName: category.displayName,
            createdAt: category.createdAt,
            isDeleted: category.isDeleted,
            products:
                category.products && category.products.length
                    ? category.products.map(this.productMapper.mapToDtoFromSchema)
                    : [],
        } as CategoryDto;
    }

    mapToDtoFromEntity(category: EntityCategory): CategoryDto {
        return {
            id: category.id,
            displayName: category.displayName,
            createdAt: category.createdAt,
            isDeleted: category.isDeleted,
            products:
                category.products && category.products.length
                    ? category.products.map(this.productMapper.mapToDtoFromEntity)
                    : [],
        };
    }

    mapToSchemaFromDto(category: CategoryDto): SchemaCategory {
        return {
            _id: category.id,
            displayName: category.displayName,
            createdAt: category.createdAt,
            isDeleted: category.isDeleted,
        };
    }

    mapToEntityFromDto(category: CategoryDto): EntityCategory {
        return {
            id: category.id,
            displayName: category.displayName,
            createdAt: category.createdAt,
            isDeleted: category.isDeleted,
        };
    }

    mapToCreateSchemaFromCreateDto(createCategory: CreateCategoryDto): CreateCategorySchema {
        return {
            displayName: createCategory.displayName,
        };
    }
}
