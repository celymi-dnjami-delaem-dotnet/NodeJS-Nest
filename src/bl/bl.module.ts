import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';

@Module({
    imports: [DbModule.forRoot()],
    providers: [CategoryService, ProductService],
    exports: [CategoryService, ProductService],
})
export class BlModule {}
