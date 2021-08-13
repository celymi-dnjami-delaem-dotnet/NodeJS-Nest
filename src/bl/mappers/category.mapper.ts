import { CategoryDto } from '../../api/dto/category.dto';
import { CreateCategoryDto } from '../../api/dto/create-category.dto';
import { ICategoryCommand } from '../commands/category.command';
import { ICreateCategoryCommand } from '../commands/create-category.command';
import { Injectable } from '@nestjs/common';
import { ProductMapper } from './product.mapper';

@Injectable()
export class CategoryMapper {
    constructor(private readonly _productMapper: ProductMapper) {}

    mapCreateToCommandFromDto(createCategoryDto: CreateCategoryDto): ICreateCategoryCommand {
        return {
            displayName: createCategoryDto.displayName,
        };
    }

    mapToCommandFromDto(categoryDto: CategoryDto): ICategoryCommand {
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

    mapToDtoFromCommand(categoryCommand: ICategoryCommand): CategoryDto {
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
