import { CreateProductDto } from '../../api/dto/actions/create-product.dto';
import { DbOptions } from '../../settings/settings.constants';
import { IBaseDb } from '../../db/types/base-db.type';
import { ICreateProduct } from '../../db/types/create-product.type';
import { Injectable } from '@nestjs/common';
import { ProductDto } from '../../api/dto/models/product.dto';
import { Product as ProductEntity } from '../../db/postgres/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { Product as ProductSchema } from '../../db/mongo/schemas/product.schema';
import { SettingsService } from '../../settings/settings.service';

@Injectable()
export class ProductAdapter {
    constructor(private readonly settingsService: SettingsService, private readonly productMapper: ProductMapper) {}

    adaptFromDbToDto(target: IBaseDb): ProductDto {
        switch (this.settingsService.dbType) {
            case DbOptions.Mongo:
                return this.productMapper.mapToDtoFromSchema(target as ProductSchema);
            case DbOptions.Postgres:
                return this.productMapper.mapToDtoFromEntity(target as ProductEntity);
        }
    }

    adaptFromDtoToDb(target: CreateProductDto): IBaseDb {
        switch (this.settingsService.dbType) {
            case DbOptions.Mongo:
                return this.productMapper.mapToSchemaFromDto(target as ProductDto);
            case DbOptions.Postgres:
                return this.productMapper.mapToEntityFromDto(target as ProductDto);
        }
    }

    adaptCreateFromDtoToDb(target: CreateProductDto): ICreateProduct {
        switch (this.settingsService.dbType) {
            case DbOptions.Mongo:
                return this.productMapper.mapToCreateSchemaFromCreateDto(target);
            case DbOptions.Postgres:
                return this.productMapper.mapToCreateEntityFromCreateDto(target);
        }
    }
}
