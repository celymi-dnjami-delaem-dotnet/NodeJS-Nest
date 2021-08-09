import { IBaseDb } from './base-db.type';
import { ICreateCategory } from './create-category.type';

export const CategoryMapperName = 'ICategoryMapper';

export interface ICategoryMapper {
    mapToCommandFromDb: (category: IBaseDb) => any;
    mapToDbFromCommand: (category: any) => IBaseDb;
    mapCreateToDbFromCommand: (createCategory: any) => ICreateCategory;
}
