import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from './settings.service';
import { ProductsController } from './api/controllers/products.controller';
import { ProductService } from './bl/services/product.service';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [ProductsController],
    providers: [SettingsService, ProductService],
})
export class AppModule {}
