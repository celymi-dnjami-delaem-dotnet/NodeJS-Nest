import { CategoryDto } from '../../api/dto/models/category.dto';
import { Category as CategoryEntity } from '../../db/postgres/entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';
import { Category as CategorySchema } from '../../db/mongo/schemas/category.schema';
import { DbOptions } from '../../settings/settings.constants';
import { IBaseDb } from '../../db/types/base-db.type';
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

    adaptFromDtoToDb(target: CategoryDto): IBaseDb {
        switch (this.settingsService.dbType) {
            case DbOptions.Mongo:
                return this.categoryMapper.mapToSchemaFromDto(target);
            case DbOptions.Postgres:
                return this.categoryMapper.mapToEntityFromDto(target);
        }
    }
}
