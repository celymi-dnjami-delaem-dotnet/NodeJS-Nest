import { CategoryMongooseRepository } from './mongo/repository/category.repository';
import { CategoryRepositoryName } from './types/category-repository.type';
import { CategorySchema, Category as SchemaCategory } from './mongo/schemas/category.schema';
import { CategoryTypeOrmRepository } from './postgres/repository/category.repository';
import { ConsoleLogger, DynamicModule, Module } from '@nestjs/common';
import { Category as EntityCategory } from './postgres/entities/category.entity';
import { Product as EntityProduct } from './postgres/entities/product.entity';
import { LoggingModule } from '../logging/logging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMongooseRepository } from './mongo/repository/product.repository';
import { ProductRepositoryName } from './types/product-repository.type';
import { ProductSchema, Product as SchemaProduct } from './mongo/schemas/product.schema';
import { ProductTypeOrmRepository } from './postgres/repository/product.repository';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { set } from 'mongoose';

@Module({})
export class DbModule {
    static forRoot(): DynamicModule {
        const imports: any = [SettingsModule];
        const moduleProviders: any = [];

        if (process.env.DB_TYPE === 'postgres') {
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
                { provide: CategoryRepositoryName, useClass: CategoryTypeOrmRepository },
                {
                    provide: ProductRepositoryName,
                    useClass: ProductTypeOrmRepository,
                },
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
                { provide: CategoryRepositoryName, useClass: CategoryMongooseRepository },
                {
                    provide: ProductRepositoryName,
                    useClass: ProductMongooseRepository,
                },
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
