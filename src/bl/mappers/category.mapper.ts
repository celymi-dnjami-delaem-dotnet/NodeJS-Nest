import { Injectable } from '@nestjs/common';
import { Category } from '../../db/schemas/category.schema';
import { CategoryDto } from '../../api/dto/models/category.dto';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';

@Injectable()
export class CategoryMapper {
    mapToDtoModel(category: Category): CategoryDto {
        return {
            id: category._id,
            displayName: category.displayName,
            createdAt: category.createdAt,
            isDeleted: category.isDeleted,
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

    mapToSchemaCreateDto(createCategory: CreateCategoryDto): Category {
        return {
            displayName: createCategory.displayName,
        } as any;
    }
}
