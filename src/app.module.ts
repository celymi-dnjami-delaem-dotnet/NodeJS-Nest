import { Module } from '@nestjs/common';
import { ProductsController } from './productsController';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [ProductsController],
    providers: [ProductService],
})
export class AppModule {}
