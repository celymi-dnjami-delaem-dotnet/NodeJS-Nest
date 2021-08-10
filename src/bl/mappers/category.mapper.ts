import { CategoryCommand } from '../commands/out/category.command';
import { CategoryDto } from '../../api/dto/out/category.dto';
import { CreateCategoryCommand } from '../commands/in/create-category.command';
import { CreateCategoryDto } from '../../api/dto/in/create-category.dto';
import { IProductBlMapper, ProductBlMapperName } from './product.mapper';
import { Inject, Injectable } from '@nestjs/common';

export interface ICategoryBlMapper {
    mapToDtoFromCommand: (categoryCommand: CategoryCommand) => CategoryDto;
    mapToCommandFromDto: (categoryDto: CategoryDto) => CategoryCommand;
    mapCreateToCommandFromDto: (createCategoryDto: CreateCategoryDto) => CreateCategoryCommand;
}

export const CategoryBlMapperName = Symbol('ICategoryBlMapper');

@Injectable()
export class CategoryMapper implements ICategoryBlMapper {
    constructor(@Inject(ProductBlMapperName) private readonly _productMapper: IProductBlMapper) {}

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
