import { Category } from '../../postgres/entities/category.entity';
import { ICategoryMapper } from '../../types/category-mapper.type';
import { ICreateCategory } from '../../types/create-category.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryEntityMapper implements ICategoryMapper {
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
