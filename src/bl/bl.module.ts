import { CategoryMapper, CategoryMapperName } from './mappers/category.mapper';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { DynamicModule, Module } from '@nestjs/common';
import { ProductMapper, ProductMapperName } from './mappers/product.mapper';
import { ProductService } from './services/product.service';
import { SettingsModule } from '../settings/settings.module';

@Module({})
export class BlModule {
    static forRoot(): DynamicModule {
        const moduleProviders = [
            CategoryService,
            ProductService,
            {
                provide: CategoryMapperName,
                useClass: CategoryMapper,
            },
            { provide: ProductMapperName, useClass: ProductMapper },
        ];

        return {
            module: BlModule,
            imports: [SettingsModule, DbModule.forRoot()],
            providers: moduleProviders,
            exports: moduleProviders,
        };
    }
}
