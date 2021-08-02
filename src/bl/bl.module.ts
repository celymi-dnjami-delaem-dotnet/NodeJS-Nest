import { CategoryMapper } from './mappers/category.mapper';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { Module } from '@nestjs/common';
import { ProductMapper } from './mappers/product.mapper';
import { ProductService } from './services/product.service';

@Module({
    imports: [DbModule],
    providers: [CategoryService, ProductService, ProductMapper, CategoryMapper],
    exports: [CategoryService, ProductService, ProductMapper, CategoryMapper],
})
export class BlModule {}
