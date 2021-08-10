import { CategoryCommand } from '../commands/out/category.command';
import { CategoryDto } from '../../api/dto/models/category.dto';
import { CreateCategoryCommand } from '../commands/in/create-category.command';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { IProductMapper, ProductMapperName } from './product.mapper';
import { Inject, Injectable } from '@nestjs/common';

export interface ICategoryMapper {
    mapToDtoFromCommand: (categoryCommand: CategoryCommand) => CategoryDto;
    mapToCommandFromDto: (categoryDto: CategoryDto) => CategoryCommand;
    mapCreateToCommandFromDto: (createCategoryDto: CreateCategoryDto) => CreateCategoryCommand;
}

export const CategoryMapperName = Symbol('ICategoryMapper');

@Injectable()
export class CategoryMapper implements ICategoryMapper {
    constructor(@Inject(ProductMapperName) private readonly _productMapper: IProductMapper) {}

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
