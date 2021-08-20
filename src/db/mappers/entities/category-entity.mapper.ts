import { BaseCategoryMapper } from '../base/base-category.mapper';
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
export class CategoryEntityMapper extends BaseCategoryMapper implements ICategoryDbMapper {
    constructor(@Inject(ProductDbMapperName) private readonly _productMapper: IProductDbMapper) {
        super();
    }

    mapSearchToDbFromCommand(searchParams: ISearchParamsCategoryCommand): ISearchParamsCategory {
        return super.mapSearchToDbFromCommand(searchParams);
    }

    mapCreateToDbFromCommand(createCategoryCommand: ICreateCategoryCommand): ICreateCategoryDb {
        return super.mapCreateToDbFromCommand(createCategoryCommand);
    }

    mapToCommandFromDb(categoryDb: Category): ICategoryCommand {
        const baseCategory = super.mapToCommandFromDb(categoryDb);

        return {
            ...baseCategory,
            id: categoryDb.id,
            products:
                categoryDb.products && categoryDb.products.length
                    ? categoryDb.products.map((x) => this._productMapper.mapToCommandFromDb(x))
                    : [],
        };
    }

    mapToDbFromCommand(categoryCommand: ICategoryCommand): Category {
        const baseCategory = super.mapToDbFromCommand(categoryCommand);

        return {
            ...baseCategory,
            id: categoryCommand.id,
        };
    }
}
