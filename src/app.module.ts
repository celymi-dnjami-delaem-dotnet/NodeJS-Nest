import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from './settings.service';
import { ProductsController } from './api/controllers/products.controller';
import { ProductService } from './bl/services/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema, CategorySchemaName } from './db/schemas/categorySchema';
import { ProductSchema, ProductSchemaName } from './db/schemas/productSchema';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB}?authSource=admin`,
            {
                useUnifiedTopology: true,
            },
        ),
        MongooseModule.forFeature([
            { name: CategorySchemaName, schema: CategorySchema },
            {
                name: ProductSchemaName,
                schema: ProductSchema,
            },
        ]),
    ],
    controllers: [ProductsController],
    providers: [SettingsService, ProductService],
})
export class AppModule {}
