import { Category, CategorySchema } from './mongo/schemas/category.schema';
import { CategoryMongooseRepository } from './mongo/repository/category.repository';
import { CategoryRepositoryName } from './types/category-repository.type';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './mongo/schemas/product.schema';
import { ProductMongooseRepository } from './mongo/repository/product.repository';
import { ProductRepositoryName } from './types/product-repository.type';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
                    }),
                    inject: [SettingsService],
                }),
            );
        } else {
            imports.push(
                MongooseModule.forRootAsync({
                    imports: [SettingsModule],
                    useFactory: async (settingsService: SettingsService) => ({
                        uri: settingsService.getMongooseConnectionString(),
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    }),
                    inject: [SettingsService],
                }),
                MongooseModule.forFeature([
                    { name: Category.name, schema: CategorySchema },
                    {
                        name: Product.name,
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
