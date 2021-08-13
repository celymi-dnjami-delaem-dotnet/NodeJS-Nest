import { Category } from '../../mongo/schemas/category.schema';
import { ICategoryCommand } from '../../../bl/commands/category.command';
import { ICategoryDbMapper } from '../types/category-mapper.type';
import { ICreateCategoryCommand } from '../../../bl/commands/create-category.command';
import { ICreateCategoryDb } from '../../base-types/create-category.type';
import { IProductDbMapper, ProductDbMapperName } from '../types/product-mapper.type';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CategorySchemaMapper implements ICategoryDbMapper {
    constructor(@Inject(ProductDbMapperName) private readonly _productMapper: IProductDbMapper) {}

    mapCreateToDbFromCommand(createCategoryCommand: ICreateCategoryCommand): ICreateCategoryDb {
        return {
            displayName: createCategoryCommand.displayName,
        };
    }

    mapToCommandFromDb(categoryDb: Category): ICategoryCommand {
        return {
            id: categoryDb._id,
            displayName: categoryDb.displayName,
            products:
                categoryDb.products && categoryDb.products.length
                    ? categoryDb.products.map(this._productMapper.mapToCommandFromDb)
                    : [],
            createdAt: categoryDb.createdAt,
            isDeleted: categoryDb.isDeleted,
        };
    }

    mapToDbFromCommand(categoryCommand: ICategoryCommand): Category {
        return {
            _id: categoryCommand.id,
            displayName: categoryCommand.displayName,
            createdAt: categoryCommand.createdAt,
            isDeleted: categoryCommand.isDeleted,
        };
    }
}
