import { CategoryCommand } from '../../../bl/commands/out/category.command';
import { CreateCategoryCommand } from '../../../bl/commands/in/create-category.command';
import { IBaseDb } from '../../base-types/base-db.type';
import { ICreateCategoryDb } from '../../base-types/create-category.type';

export interface ICategoryDbMapper {
    mapToCommandFromDb: (categoryDb: IBaseDb) => CategoryCommand;
    mapToDbFromCommand: (categoryCommand: CategoryCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createCategoryCommand: CreateCategoryCommand) => ICreateCategoryDb;
}

export const CategoryDbMapperName = Symbol('ICategoryDbMapper');
