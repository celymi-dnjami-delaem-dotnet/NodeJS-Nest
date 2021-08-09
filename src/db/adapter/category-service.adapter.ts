import { CategoryMapperName, ICategoryMapper } from '../types/category-mapper.type';
import { CategoryRepositoryName, ICategoryRepository } from '../types/category-repository.type';
import { ICategoryServiceAdapter } from '../types/category-service-adapter.type';
import { Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CategoryServiceAdapter implements ICategoryServiceAdapter {
    constructor(
        @Inject(CategoryRepositoryName) private readonly _categoryRepository: ICategoryRepository,
        @Inject(CategoryMapperName) private readonly _categoryMapper: ICategoryMapper,
    ) {}
}
