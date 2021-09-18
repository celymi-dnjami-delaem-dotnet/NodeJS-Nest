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
import { LastRating as EntityLastRating } from './postgres/entities/last-rating.entity';
import { Product as EntityProduct } from './postgres/entities/product.entity';
import { Rating as EntityRating } from './postgres/entities/rating.entity';
import { Role as EntityRole } from './postgres/entities/role.entity';
import { User as EntityUser } from './postgres/entities/user.entity';
import { UserToken as EntityUserToken } from './postgres/entities/user-token.entity';
import { LastRatingDbMapperName } from './mappers/types/last-rating-mapper.type';
import { LastRatingEntityMapper } from './mappers/entities/last-rating-entity.mapper';
import { LastRatingRepositoryName } from './base-types/last-rating-repository.type';
import { LastRatingTypeOrmRepository } from './postgres/repository/last-rating.repository';
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
import { RatingDbMapperName } from './mappers/types/rating-mapper.type';
import { RatingEntityMapper } from './mappers/entities/rating-entity.mapper';
import { RatingMongooseRepository } from './mongo/repository/rating.repository';
import { RatingRepositoryName } from './base-types/rating-repository.type';
import { RatingSchema, Rating as SchemaRating } from './mongo/schemas/rating.schema';
import { RatingSchemaMapper } from './mappers/schemas/rating-schema.mapper';
import { RatingServiceAdapter, RatingServiceAdapterName } from './adapter/rating-service.adapter';
import { RatingTypeOrmRepository } from './postgres/repository/rating.repository';
import { RoleDbMapperName } from './mappers/types/role-mapper.type';
import { RoleEntityMapper } from './mappers/entities/role-entity.mapper';
import { RoleMongooseRepository } from './mongo/repository/role.repository';
import { RoleRepositoryName } from './base-types/role-repository.type';
import { RoleSchema, Role as SchemaRole } from './mongo/schemas/role.schema';
import { RoleSchemaMapper } from './mappers/schemas/role-schema.mapper';
import { RoleServiceAdapter, RoleServiceAdapterName } from './adapter/role-service.adapter';
import { RoleTypeOrmRepository } from './postgres/repository/role.repository';
import { User as SchemaUser, UserSchema } from './mongo/schemas/user.schema';
import { UserToken as SchemaUserToken, UserTokenSchema } from './mongo/schemas/user-token.schema';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDbMapperName } from './mappers/types/user-mapper.type';
import { UserEntityMapper } from './mappers/entities/user-entity.mapper';
import { UserMongooseRepository } from './mongo/repository/user.repository';
import { UserRepositoryName } from './base-types/user-repository.type';
import { UserSchemaMapper } from './mappers/schemas/user-schema.mapper';
import { UserServiceAdapter, UserServiceAdapterName } from './adapter/user-service.adapter';
import { UserTokenDbMapperName } from './mappers/types/user-token-mapper.type';
import { UserTokenEntityMapper } from './mappers/entities/user-token-entity.mapper';
import { UserTokenMongooseRepository } from './mongo/repository/user-token.repository';
import { UserTokenRepositoryName } from './base-types/user-token-repository.type';
import { UserTokenSchemaMapper } from './mappers/schemas/user-token-schema.mapper';
import { UserTokenServiceAdapter, UserTokenServiceAdapterName } from './adapter/user-token-service.adapter';
import { UserTokenTypeOrmRepository } from './postgres/repository/user-token.repository';
import { UserTypeOrmRepository } from './postgres/repository/user.repository';
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
            {
                provide: UserServiceAdapterName,
                useClass: UserServiceAdapter,
            } as Provider,
            {
                provide: RoleServiceAdapterName,
                useClass: RoleServiceAdapter,
            } as Provider,
            {
                provide: UserTokenServiceAdapterName,
                useClass: UserTokenServiceAdapter,
            } as Provider,
            {
                provide: RatingServiceAdapterName,
                useClass: RatingServiceAdapter,
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
                        ssl: settingsService.dbSsl && { rejectUnauthorized: false },
                    }),
                    inject: [SettingsService],
                }),
                TypeOrmModule.forFeature([
                    EntityCategory,
                    EntityProduct,
                    EntityUser,
                    EntityRole,
                    EntityUserToken,
                    EntityRating,
                    EntityLastRating,
                ]),
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
                    provide: UserTokenRepositoryName,
                    useClass: UserTokenTypeOrmRepository,
                } as Provider,
                {
                    provide: RatingRepositoryName,
                    useClass: RatingTypeOrmRepository,
                } as Provider,
                {
                    provide: LastRatingRepositoryName,
                    useClass: LastRatingTypeOrmRepository,
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
                {
                    provide: UserTokenDbMapperName,
                    useClass: UserTokenEntityMapper,
                } as Provider,
                {
                    provide: RatingDbMapperName,
                    useClass: RatingEntityMapper,
                } as Provider,
                {
                    provide: LastRatingDbMapperName,
                    useClass: LastRatingEntityMapper,
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
                    {
                        name: SchemaRole.name,
                        schema: RoleSchema,
                    },
                    {
                        name: SchemaUserToken.name,
                        schema: UserTokenSchema,
                    },
                    {
                        name: SchemaRating.name,
                        schema: RatingSchema,
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
                    provide: RoleRepositoryName,
                    useClass: RoleMongooseRepository,
                } as Provider,
                {
                    provide: UserTokenRepositoryName,
                    useClass: UserTokenMongooseRepository,
                } as Provider,
                {
                    provide: RatingRepositoryName,
                    useClass: RatingMongooseRepository,
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
                {
                    provide: RoleDbMapperName,
                    useClass: RoleSchemaMapper,
                } as Provider,
                {
                    provide: UserTokenDbMapperName,
                    useClass: UserTokenSchemaMapper,
                } as Provider,
                {
                    provide: RatingDbMapperName,
                    useClass: RatingSchemaMapper,
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
