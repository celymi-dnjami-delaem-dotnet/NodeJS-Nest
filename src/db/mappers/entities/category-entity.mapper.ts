import { Category } from '../../postgres/entities/category.entity';
import { CategoryCommand } from '../../../bl/commands/out/category.command';
import { CreateCategoryCommand } from '../../../bl/commands/in/create-category.command';
import { ICategoryMapper } from '../types/category-mapper.type';
import { ICreateCategoryDb } from '../../types/create-category.type';
import { IProductMapper, ProductMapperName } from '../types/product-mapper.type';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryEntityMapper implements ICategoryMapper {
    constructor(@Inject(ProductMapperName) private readonly _productMapper: IProductMapper) {}

    mapCreateToDbFromCommand(createCategoryCommand: CreateCategoryCommand): ICreateCategoryDb {
        return {
            displayName: createCategoryCommand.displayName,
        };
    }

    mapToCommandFromDb(categoryDb: Category): CategoryCommand {
        return {
            id: categoryDb.id,
            displayName: categoryDb.displayName,
            products:
                categoryDb.products && categoryDb.products.length
                    ? categoryDb.products.map((x) => this._productMapper.mapToCommandFromDb(x))
                    : [],
            createdAt: categoryDb.createdAt,
            isDeleted: categoryDb.isDeleted,
        };
    }

    mapToDbFromCommand(categoryCommand: CategoryCommand): Category {
        return {
            id: categoryCommand.id,
            displayName: categoryCommand.displayName,
            createdAt: categoryCommand.createdAt,
            isDeleted: categoryCommand.isDeleted,
        };
    }
}
