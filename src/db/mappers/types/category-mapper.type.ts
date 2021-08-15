import { IBaseDb } from '../../base-types/base-db.type';
import { ICategoryCommand } from '../../../bl/commands/category.command';
import { ICreateCategoryCommand } from '../../../bl/commands/create-category.command';
import { ICreateCategoryDb } from '../../base-types/create-category.type';

export interface ICategoryDbMapper {
    mapToCommandFromDb: (categoryDb: IBaseDb) => ICategoryCommand;
    mapToDbFromCommand: (categoryCommand: ICategoryCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createCategoryCommand: ICreateCategoryCommand) => ICreateCategoryDb;
}

export const CategoryDbMapperName = Symbol('ICategoryDbMapper');
