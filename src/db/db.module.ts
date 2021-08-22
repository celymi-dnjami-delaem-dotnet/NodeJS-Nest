import { CategoryDbMapperName } from './mappers/types/category-mapper.type';
import { CategoryEntityMapper } from './mappers/entities/category-entity.mapper';
import { CategoryMongooseRepository } from './mongo/repository/category.repository';
import { CategoryRepositoryName } from './base-types/category-repository.type';
import { CategorySchema, Category as SchemaCategory } from './mongo/schemas/category.schema';
import { CategorySchemaMapper } from './mappers/schemas/category-schema.mapper';
import { CategoryServiceAdapter } from './adapter/category-service.adapter';
import { CategoryTypeOrmRepository } from './postgres/repository/category.repository';
import { ConsoleLogger, DynamicModule, Module, Provider } from '@nestjs/common';
import { DbOptions } from '../settings/settings.constants';
import { Category as EntityCategory } from './postgres/entities/category.entity';
import { Product as EntityProduct } from './postgres/entities/product.entity';
import { Role as EntityRole } from './postgres/entities/role.entity';
import { User as EntityUser } from './postgres/entities/user.entity';
import { LoggingModule } from '../logging/logging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductDbMapperName } from './mappers/types/product-mapper.type';
import { ProductEntityMapper } from './mappers/entities/product-entity.mapper';
import { ProductMongooseRepository } from './mongo/repository/product.repository';
import { ProductRepositoryName } from './base-types/product-repository.type';
import { ProductSchema, Product as SchemaProduct } from './mongo/schemas/product.schema';
import { ProductSchemaMapper } from './mappers/schemas/product-schema.mapper';
import { ProductServiceAdapter } from './adapter/product-service.adapter';
import { ProductTypeOrmRepository } from './postgres/repository/product.repository';
import { RoleDbMapperName } from './mappers/types/role-mapper.type';
import { RoleEntityMapper } from './mappers/entities/role-entity.mapper';
import { RoleRepositoryName } from './base-types/role-repository.type';
import { RoleServiceAdapter } from './adapter/role-service.adapter';
import { RoleTypeOrmRepository } from './postgres/repository/role.repository';
import { User as SchemaUser, UserSchema } from './mongo/schemas/user.schema';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDbMapperName } from './mappers/types/user-mapper.type';
import { UserEntityMapper } from './mappers/entities/user-entity.mapper';
import { UserMongooseRepository } from './mongo/repository/user.repository';
import { UserRepositoryName } from './base-types/user-repository.type';
import { UserSchemaMapper } from './mappers/schemas/user-schema.mapper';
import { UserServiceAdapter } from './adapter/user-service.adapter';
import { UserTypeOrmRepository } from './postgres/repository/user.repository';
import { set } from 'mongoose';

@Module({})
export class DbModule {
    static forRoot(): DynamicModule {
        const imports: any = [SettingsModule];
        const moduleProviders: Provider[] = [
            CategoryServiceAdapter,
            ProductServiceAdapter,
            UserServiceAdapter,
            RoleServiceAdapter,
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
                TypeOrmModule.forFeature([EntityCategory, EntityProduct, EntityUser, EntityRole]),
            );

            moduleProviders.push(
                { provide: CategoryRepositoryName, useClass: CategoryTypeOrmRepository } as Provider,
                {
                    provide: ProductRepositoryName,
                    useClass: ProductTypeOrmRepository,
                } as Provider,
                {
                    provide: UserRepositoryName,
                    useClass: UserTypeOrmRepository,
                } as Provider,
                {
                    provide: RoleRepositoryName,
                    useClass: RoleTypeOrmRepository,
                } as Provider,
                {
                    provide: CategoryDbMapperName,
                    useClass: CategoryEntityMapper,
                } as Provider,
                {
                    provide: ProductDbMapperName,
                    useClass: ProductEntityMapper,
                } as Provider,
                {
                    provide: UserDbMapperName,
                    useClass: UserEntityMapper,
                } as Provider,
                {
                    provide: RoleDbMapperName,
                    useClass: RoleEntityMapper,
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
                            useCreateIndex: true,
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
                    {
                        name: SchemaUser.name,
                        schema: UserSchema,
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
                    provide: UserRepositoryName,
                    useClass: UserMongooseRepository,
                } as Provider,
                {
                    provide: CategoryDbMapperName,
                    useClass: CategorySchemaMapper,
                } as Provider,
                {
                    provide: ProductDbMapperName,
                    useClass: ProductSchemaMapper,
                } as Provider,
                {
                    provide: UserDbMapperName,
                    useClass: UserSchemaMapper,
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
