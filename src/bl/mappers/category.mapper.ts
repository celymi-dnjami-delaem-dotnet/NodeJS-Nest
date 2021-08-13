import { CategoryCommand } from '../commands/out/category.command';
import { CategoryDto } from '../../api/dto/out/category.dto';
import { CreateCategoryCommand } from '../commands/in/create-category.command';
import { CreateCategoryDto } from '../../api/dto/in/create-category.dto';
import { Injectable } from '@nestjs/common';
import { ProductMapper } from './product.mapper';

@Injectable()
export class CategoryMapper {
    constructor(private readonly _productMapper: ProductMapper) {}

    mapCreateToCommandFromDto(createCategoryDto: CreateCategoryDto): CreateCategoryCommand {
        return {
            displayName: createCategoryDto.displayName,
        };
    }

    mapToCommandFromDto(categoryDto: CategoryDto): CategoryCommand {
        return {
            id: categoryDto.id,
            products:
                categoryDto.products && categoryDto.products.length
                    ? categoryDto.products.map((x) => this._productMapper.mapToCommandFromDto(x))
                    : [],
            displayName: categoryDto.displayName,
            createdAt: categoryDto.createdAt,
            isDeleted: categoryDto.isDeleted,
        };
    }

    mapToDtoFromCommand(categoryCommand: CategoryCommand): CategoryDto {
        return {
            id: categoryCommand.id,
            products:
                categoryCommand.products && categoryCommand.products
                    ? categoryCommand.products.map((x) => this._productMapper.mapToDtoFromCommand(x))
                    : [],
            displayName: categoryCommand.displayName,
            createdAt: categoryCommand.createdAt,
            isDeleted: categoryCommand.isDeleted,
        };
    }
}
