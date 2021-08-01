import { Category, CategorySchema } from './db/schemas/category.schema';
import { CategoryController } from './api/controllers/category.controller';
import { CategoryMapper } from './bl/mappers/category.mapper';
import { CategoryRepository } from './db/repository/category.repository';
import { CategoryService } from './bl/services/category.service';
import { HealthCheckController } from './api/controllers/health-check.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './db/schemas/product.schema';
import { ProductController } from './api/controllers/product.controller';
import { ProductMapper } from './bl/mappers/product.mapper';
import { ProductRepository } from './db/repository/product.repository';
import { ProductService } from './bl/services/product.service';
import { SettingsModule } from './settings.module';
import { SettingsService } from './settings.service';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        SettingsModule,
        MongooseModule.forRootAsync({
            imports: [SettingsModule],
            useFactory: async (settingsService: SettingsService) => ({
                uri: settingsService.getMongooseConnectionString(),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
            inject: [SettingsService],
        }),
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
        TerminusModule,
    ],
    controllers: [ProductController, CategoryController, HealthCheckController],
    providers: [CategoryService, ProductService, ProductMapper, CategoryMapper, ProductRepository, CategoryRepository],
})
export class AppModule {}
