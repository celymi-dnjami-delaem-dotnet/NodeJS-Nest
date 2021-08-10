import { CreateProductCommand } from '../../../bl/commands/in/create-product.command';
import { ICreateProductSchema } from '../../mongo/types/create-product.type';
import { IProductMapper } from '../types/product-mapper.type';
import { Injectable } from '@nestjs/common';
import { Product } from '../../mongo/schemas/product.schema';
import { ProductCommand } from '../../../bl/commands/out/product.command';

@Injectable()
export class ProductSchemaMapper implements IProductMapper {
    mapCreateToDbFromCommand(createProductCommand: CreateProductCommand): ICreateProductSchema {
        return {
            displayName: createProductCommand.displayName,
            price: createProductCommand.price,
            category: createProductCommand.categoryId,
        };
    }

    mapToCommandFromDb(productDb: Product): ProductCommand {
        return {
            id: productDb._id,
            displayName: productDb.displayName,
            categoryId: productDb.category && productDb.category._id,
            price: productDb.price,
            totalRating: productDb.totalRating,
            createdAt: productDb.createdAt,
            isDeleted: productDb.isDeleted,
        };
    }

    mapToDbFromCommand(productCommand: ProductCommand): Product {
        return {
            _id: productCommand.id,
            displayName: productCommand.displayName,
            price: productCommand.price,
            totalRating: productCommand.totalRating,
            createdAt: productCommand.createdAt,
            isDeleted: productCommand.isDeleted,
        };
    }
}
