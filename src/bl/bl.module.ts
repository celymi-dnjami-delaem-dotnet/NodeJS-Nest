import { CategoryBlMapperName, CategoryMapper } from './mappers/category.mapper';
import { CategoryService, CategoryServiceName } from './services/category.service';
import { DbModule } from '../db/db.module';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ProductBlMapperName, ProductMapper } from './mappers/product.mapper';
import { ProductService, ProductServiceName } from './services/product.service';
import { SettingsModule } from '../settings/settings.module';

@Module({})
export class BlModule {
    static forRoot(): DynamicModule {
        const moduleProviders: Provider[] = [
            {
                provide: CategoryServiceName,
                useClass: CategoryService,
            },
            {
                provide: ProductServiceName,
                useClass: ProductService,
            },
            {
                provide: CategoryBlMapperName,
                useClass: CategoryMapper,
            },
            { provide: ProductBlMapperName, useClass: ProductMapper },
        ];

        return {
            module: BlModule,
            imports: [SettingsModule, DbModule.forRoot()],
            providers: moduleProviders,
            exports: moduleProviders,
        };
    }
}
