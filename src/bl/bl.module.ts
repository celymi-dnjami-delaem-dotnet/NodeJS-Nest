import { CategoryBlMapperName, CategoryMapper } from './mappers/category.mapper';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { DynamicModule, Module } from '@nestjs/common';
import { ProductBlMapperName, ProductMapper } from './mappers/product.mapper';
import { ProductService } from './services/product.service';
import { SettingsModule } from '../settings/settings.module';

@Module({})
export class BlModule {
    static forRoot(): DynamicModule {
        const moduleProviders = [
            CategoryService,
            ProductService,
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
