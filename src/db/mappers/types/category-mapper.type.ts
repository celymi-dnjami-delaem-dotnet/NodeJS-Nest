import { IBaseDb } from '../../base-types/base-db.type';
import { ICategoryCommand } from '../../../bl/commands/category.command';
import { ICreateCategoryCommand } from '../../../bl/commands/create-category.command';
import { ICreateCategoryDb } from '../../base-types/create-category.type';
import { ISearchParamsCategory } from '../../base-types/search-params-category.type';
import { ISearchParamsCategoryCommand } from '../../../bl/commands/search-params-category.command';

export interface ICategoryDbMapper {
    mapToCommandFromDb: (categoryDb: IBaseDb) => ICategoryCommand;
    mapToDbFromCommand: (categoryCommand: ICategoryCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createCategoryCommand: ICreateCategoryCommand) => ICreateCategoryDb;
    mapSearchToDbFromCommand: (searchParams: ISearchParamsCategoryCommand) => ISearchParamsCategory;
}

export const CategoryDbMapperName = Symbol('ICategoryDbMapper');
