import { CategoryDto } from '../../api/dto/category.dto';
import { CreateCategoryDto } from '../../api/dto/create-category.dto';
import { ICategoryCommand } from '../commands/category.command';
import { ICreateCategoryCommand } from '../commands/create-category.command';
import { ProductMapper } from './product.mapper';

export class CategoryMapper {
    static mapCreateToCommandFromDto(createCategoryDto: CreateCategoryDto): ICreateCategoryCommand {
        return {
            displayName: createCategoryDto.displayName,
        };
    }

    static mapToCommandFromDto(categoryDto: CategoryDto): ICategoryCommand {
        return {
            id: categoryDto.id,
            products:
                categoryDto.products && categoryDto.products.length
                    ? categoryDto.products.map(ProductMapper.mapToCommandFromDto)
                    : [],
            displayName: categoryDto.displayName,
            createdAt: categoryDto.createdAt,
            isDeleted: categoryDto.isDeleted,
        };
    }

    static mapToDtoFromCommand(categoryCommand: ICategoryCommand): CategoryDto {
        return {
            id: categoryCommand.id,
            products:
                categoryCommand.products && categoryCommand.products
                    ? categoryCommand.products.map(ProductMapper.mapToDtoFromCommand)
                    : [],
            displayName: categoryCommand.displayName,
            createdAt: categoryCommand.createdAt,
            isDeleted: categoryCommand.isDeleted,
        };
    }
}
