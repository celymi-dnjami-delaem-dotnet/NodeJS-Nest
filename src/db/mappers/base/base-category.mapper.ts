import { IBaseCategory } from '../../base-types/base-category.type';
import { ICategoryCommand } from '../../../bl/commands/category.command';
import { ICategoryDbMapper } from '../types/category-mapper.type';
import { ICreateCategoryCommand } from '../../../bl/commands/create-category.command';
import { ICreateCategoryDb } from '../../base-types/create-category.type';
import { ISearchParamsCategory } from '../../base-types/search-params-category.type';
import { ISearchParamsCategoryCommand } from '../../../bl/commands/search-params-category.command';

export abstract class BaseCategoryMapper implements ICategoryDbMapper {
    mapCreateToDbFromCommand(createCategoryCommand: ICreateCategoryCommand): ICreateCategoryDb {
        return {
            displayName: createCategoryCommand.displayName,
        };
    }

    mapSearchToDbFromCommand(searchParams: ISearchParamsCategoryCommand): ISearchParamsCategory {
        return {
            includeProducts: searchParams.includeProducts,
            includeTopCategories: searchParams.includeTopProducts,
        };
    }

    mapToCommandFromDb(categoryDb: IBaseCategory): ICategoryCommand {
        return {
            displayName: categoryDb.displayName,
            createdAt: categoryDb.createdAt,
            isDeleted: categoryDb.isDeleted,
        };
    }

    mapToDbFromCommand(categoryCommand: ICategoryCommand): IBaseCategory {
        return {
            displayName: categoryCommand.displayName,
            createdAt: categoryCommand.createdAt,
            isDeleted: categoryCommand.isDeleted,
        };
    }
}
