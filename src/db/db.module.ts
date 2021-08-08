import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryRepository } from './repository/category.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repository/product.repository';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';

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
    ],
    providers: [ProductRepository, CategoryRepository],
    exports: [ProductRepository, CategoryRepository],
})
export class DbModule {}
