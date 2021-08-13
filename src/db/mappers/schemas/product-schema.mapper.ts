import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { ICreateProductSchema } from '../../mongo/types/create-product.type';
import { IProductCommand } from '../../../bl/commands/product.command';
import { IProductDbMapper } from '../types/product-mapper.type';
import { Injectable } from '@nestjs/common';
import { Product } from '../../mongo/schemas/product.schema';

@Injectable()
export class ProductSchemaMapper implements IProductDbMapper {
    mapCreateToDbFromCommand(createProductCommand: ICreateProductCommand): ICreateProductSchema {
        return {
            displayName: createProductCommand.displayName,
            price: createProductCommand.price,
            category: createProductCommand.categoryId,
        };
    }

    mapToCommandFromDb(productDb: Product): IProductCommand {
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

    mapToDbFromCommand(productCommand: IProductCommand): Product {
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
