import { Category } from '../../db/schemas/category.schema';
import { CategoryDto } from '../../api/dto/models/category.dto';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { CreateCategorySchema } from '../../db/schemas/create-category.schema';
import { Injectable } from '@nestjs/common';
import { ProductMapper } from './product.mapper';

@Injectable()
export class CategoryMapper {
    constructor(private readonly productMapper: ProductMapper) {}

    mapToDtoModel(category: Category): CategoryDto {
        return {
            id: category._id,
            displayName: category.displayName,
            createdAt: category.createdAt,
            isDeleted: category.isDeleted,
            products:
                category.products && category.products.length ? category.products.map(this.productMapper.mapToDto) : [],
        } as CategoryDto;
    }

    mapToSchema(category: CategoryDto): Category {
        return {
            _id: category.id,
            displayName: category.displayName,
            createdAt: category.createdAt,
            isDeleted: category.isDeleted,
        };
    }

    mapToCreateSchema(createCategory: CreateCategoryDto): CreateCategorySchema {
        return {
            displayName: createCategory.displayName,
        };
    }
}
