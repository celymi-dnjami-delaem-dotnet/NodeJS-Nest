import { CategoryDbMapperName } from './mappers/types/category-mapper.type';
import { CategoryEntityMapper } from './mappers/entities/category-entity.mapper';
import { CategoryMongooseRepository } from './mongo/repository/category.repository';
import { CategoryRepositoryName } from './base-types/category-repository.type';
import { CategorySchema, Category as SchemaCategory } from './mongo/schemas/category.schema';
import { CategorySchemaMapper } from './mappers/schemas/category-schema.mapper';
import { CategoryServiceAdapter, CategoryServiceAdapterName } from './adapter/category-service.adapter';
import { CategoryTypeOrmRepository } from './postgres/repository/category.repository';
import { ConsoleLogger, DynamicModule, Module, Provider } from '@nestjs/common';
import { DbOptions } from '../settings/settings.constants';
import { Category as EntityCategory } from './postgres/entities/category.entity';
import { Product as EntityProduct } from './postgres/entities/product.entity';
import { LoggingModule } from '../logging/logging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductDbMapperName } from './mappers/types/product-mapper.type';
import { ProductEntityMapper } from './mappers/entities/product-entity.mapper';
import { ProductMongooseRepository } from './mongo/repository/product.repository';
import { ProductRepositoryName } from './base-types/product-repository.type';
import { ProductSchema, Product as SchemaProduct } from './mongo/schemas/product.schema';
import { ProductSchemaMapper } from './mappers/schemas/product-schema.mapper';
import { ProductServiceAdapter, ProductServiceAdapterName } from './adapter/product-service.adapter';
import { ProductTypeOrmRepository } from './postgres/repository/product.repository';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { set } from 'mongoose';

@Module({})
export class DbModule {
    static forRoot(): DynamicModule {
        const imports: any = [SettingsModule];
        const moduleProviders: Provider[] = [
            {
                provide: CategoryServiceAdapterName,
                useClass: CategoryServiceAdapter,
            } as Provider,
            {
                provide: ProductServiceAdapterName,
                useClass: ProductServiceAdapter,
            } as Provider,
        ];

        if (process.env.DB_TYPE === DbOptions.Postgres) {
            imports.push(
                TypeOrmModule.forRootAsync({
                    imports: [SettingsModule],
                    useFactory: async (settingsService: SettingsService) => ({
                        type: 'postgres',
                        host: settingsService.dbHost,
                        port: settingsService.dbPort,
                        username: settingsService.dbUser,
                        password: settingsService.dbPassword,
                        database: settingsService.dbName,
                        autoLoadEntities: true,
                        synchronize: true,
                    }),
                    inject: [SettingsService],
                }),
                TypeOrmModule.forFeature([EntityCategory, EntityProduct]),
            );

            moduleProviders.push(
                { provide: CategoryRepositoryName, useClass: CategoryTypeOrmRepository } as Provider,
                {
                    provide: ProductRepositoryName,
                    useClass: ProductTypeOrmRepository,
                } as Provider,
                {
                    provide: CategoryDbMapperName,
                    useClass: CategoryEntityMapper,
                } as Provider,
                {
                    provide: ProductDbMapperName,
                    useClass: ProductEntityMapper,
                } as Provider,
            );
        } else {
            imports.push(
                MongooseModule.forRootAsync({
                    imports: [SettingsModule, LoggingModule],
                    useFactory: async (settingsService: SettingsService, consoleLogger: ConsoleLogger) => {
                        if (process.env.NODE_ENV !== 'production') {
                            set('debug', (collection, method, query) => {
                                consoleLogger.debug(`${collection}.${method}(${JSON.stringify(query)})`);
                            });
                        }

                        return {
                            uri: settingsService.getMongooseConnectionString(),
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                        };
                    },
                    inject: [SettingsService, ConsoleLogger],
                }),
                MongooseModule.forFeature([
                    { name: SchemaCategory.name, schema: CategorySchema },
                    {
                        name: SchemaProduct.name,
                        schema: ProductSchema,
                    },
                ]),
            );

            moduleProviders.push(
                { provide: CategoryRepositoryName, useClass: CategoryMongooseRepository } as Provider,
                {
                    provide: ProductRepositoryName,
                    useClass: ProductMongooseRepository,
                } as Provider,
                {
                    provide: CategoryDbMapperName,
                    useClass: CategorySchemaMapper,
                } as Provider,
                {
                    provide: ProductDbMapperName,
                    useClass: ProductSchemaMapper,
                } as Provider,
            );
        }

        return {
            module: DbModule,
            imports,
            providers: moduleProviders,
            exports: moduleProviders,
        };
    }
}
