import { Category } from '../../mongo/schemas/category.schema';
import { ICategoryMapper } from '../../types/category-mapper.type';
import { ICreateCategory } from '../../types/create-category.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategorySchemaMapper implements ICategoryMapper {
    mapToCommandFromDb(category: Category): any {}

    mapToDbFromCommand(category: any): Category {
        return undefined;
    }

    mapCreateToDbFromCommand(createCategory: any): ICreateCategory {
        return {
            displayName: createCategory.displayName,
        };
    }
}
