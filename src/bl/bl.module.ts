import { CategoryAdapter } from './adapters/category.adapter';
import { CategoryMapper } from './mappers/category.mapper';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { Module } from '@nestjs/common';
import { ProductAdapter } from './adapters/product.adapter';
import { ProductMapper } from './mappers/product.mapper';
import { ProductService } from './services/product.service';

@Module({
    imports: [DbModule.forRoot()],
    providers: [CategoryService, ProductService, CategoryAdapter, ProductAdapter, ProductMapper, CategoryMapper],
    exports: [CategoryService, ProductService, CategoryAdapter, ProductAdapter, ProductMapper, CategoryMapper],
})
export class BlModule {}
