import { CategoryCommand } from '../../../bl/commands/out/category.command';
import { CreateCategoryCommand } from '../../../bl/commands/in/create-category.command';
import { IBaseDb } from '../../types/base-db.type';
import { ICreateCategoryDb } from '../../types/create-category.type';

export interface ICategoryMapper {
    mapToCommandFromDb: (categoryDb: IBaseDb) => CategoryCommand;
    mapToDbFromCommand: (categoryCommand: CategoryCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createCategoryCommand: CreateCategoryCommand) => ICreateCategoryDb;
}

export const CategoryMapperName = Symbol('ICategoryMapper');
