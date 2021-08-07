import { CategoryAdapter } from './adapters/category.adapter';
import { CategoryMapper } from './mappers/category.mapper';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { Module } from '@nestjs/common';
import { ProductAdapter } from './adapters/product.adapter';
import { ProductMapper } from './mappers/product.mapper';
import { ProductService } from './services/product.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
    imports: [SettingsModule, DbModule.forRoot()],
    providers: [CategoryService, ProductService, CategoryAdapter, ProductAdapter, CategoryMapper, ProductMapper],
    exports: [CategoryService, ProductService, CategoryAdapter, ProductAdapter, CategoryMapper, ProductMapper],
})
export class BlModule {}
