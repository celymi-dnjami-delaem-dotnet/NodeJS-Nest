import { CategoryDto } from '../../api/dto/models/category.dto';
import { Category as CategoryEntity } from '../postgres/entities/category.entity';
import { CategoryMapper } from '../../bl/mappers/category.mapper';
import { Category as CategorySchema } from '../mongo/schemas/category.schema';
import { CreateCategoryDto } from '../../api/dto/actions/create-category.dto';
import { DbOptions } from '../../settings/settings.constants';
import { IBaseDb } from '../types/base-db.type';
import { ICreateCategory } from '../types/create-category.type';
import { Injectable } from '@nestjs/common';
import { SettingsService } from '../../settings/settings.service';

@Injectable()
export class CategoryAdapter {
    constructor(private readonly settingsService: SettingsService, private readonly categoryMapper: CategoryMapper) {}

    adaptFromDbToDto(target: IBaseDb): CategoryDto {
        switch (this.settingsService.dbType) {
            case DbOptions.Mongo:
                return this.categoryMapper.mapToDtoFromSchema(target as CategorySchema);
            case DbOptions.Postgres:
                return this.categoryMapper.mapToDtoFromEntity(target as CategoryEntity);
        }
    }

    adaptFromDtoToDb(target: CreateCategoryDto): IBaseDb {
        switch (this.settingsService.dbType) {
            case DbOptions.Mongo:
                return this.categoryMapper.mapToSchemaFromDto(target as CategoryDto);
            case DbOptions.Postgres:
                return this.categoryMapper.mapToEntityFromDto(target as CategoryDto);
        }
    }

    adaptCreateFromDtoToDb(target: CreateCategoryDto): ICreateCategory {
        return this.categoryMapper.mapToCreateDbFromCreateDto(target as CategoryDto);
    }
}
