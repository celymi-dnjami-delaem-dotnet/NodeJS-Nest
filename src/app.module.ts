import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from './settings.service';
import { ProductController } from './api/controllers/product.controller';
import { ProductService } from './bl/services/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './db/schemas/category.schema';
import { Product, ProductSchema } from './db/schemas/product.schema';
import { ProductMapper } from './bl/mappers/product.mapper';
import { ProductRepository } from './db/repository/product.repository';
import { CategoryRepository } from './db/repository/category.repository';
import { CategoryMapper } from './bl/mappers/category.mapper';
import { CategoryService } from './bl/services/category.service';
import { CategoryController } from './api/controllers/category.controller';

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
            { name: Category.name, schema: CategorySchema },
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
    ],
    controllers: [ProductController, CategoryController],
    providers: [
        SettingsService,
        CategoryService,
        ProductService,
        ProductMapper,
        CategoryMapper,
        ProductRepository,
        CategoryRepository,
    ],
})
export class AppModule {}
