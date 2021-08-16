import { Category } from '../../postgres/entities/category.entity';
import { ICategoryCommand } from '../../../bl/commands/category.command';
import { ICategoryDbMapper } from '../types/category-mapper.type';
import { ICreateCategoryCommand } from '../../../bl/commands/create-category.command';
import { ICreateCategoryDb } from '../../base-types/create-category.type';
import { IProductDbMapper, ProductDbMapperName } from '../types/product-mapper.type';
import { ISearchParamsCategory } from '../../base-types/search-params-category.type';
import { ISearchParamsCategoryCommand } from '../../../bl/commands/search-params-category.command';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryEntityMapper implements ICategoryDbMapper {
    constructor(@Inject(ProductDbMapperName) private readonly _productMapper: IProductDbMapper) {}

    mapCreateToDbFromCommand(createCategoryCommand: ICreateCategoryCommand): ICreateCategoryDb {
        return {
            displayName: createCategoryCommand.displayName,
        };
    }

    mapToCommandFromDb(categoryDb: Category): ICategoryCommand {
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

    mapToDbFromCommand(categoryCommand: ICategoryCommand): Category {
        return {
            id: categoryCommand.id,
            displayName: categoryCommand.displayName,
            createdAt: categoryCommand.createdAt,
            isDeleted: categoryCommand.isDeleted,
        };
    }

    mapSearchToDbFromCommand(searchParams: ISearchParamsCategoryCommand): ISearchParamsCategory {
        return {
            includeProducts: searchParams.includeProducts,
            includeTopCategories: searchParams.includeTopProducts,
        };
    }
}
