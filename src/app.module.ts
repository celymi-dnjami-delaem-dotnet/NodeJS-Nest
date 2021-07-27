import { Module } from '@nestjs/common';
import { ProductsController } from './productsController';
import { ProductService } from './product.service';

@Module({
    imports: [],
    controllers: [ProductsController],
    providers: [ProductService],
})
export class AppModule {}
