import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { ICreateProductEntity } from '../../postgres/types/create-product.type';
import { IProductCommand } from '../../../bl/commands/product.command';
import { IProductDbMapper } from '../types/product-mapper.type';
import { Injectable } from '@nestjs/common';
import { Product } from '../../postgres/entities/product.entity';

@Injectable()
export class ProductEntityMapper implements IProductDbMapper {
    mapCreateToDbFromCommand(createProductCommand: ICreateProductCommand): ICreateProductEntity {
        return {
            displayName: createProductCommand.displayName,
            price: createProductCommand.price,
            categoryId: createProductCommand.categoryId,
        };
    }

    mapToCommandFromDb(productDb: Product): IProductCommand {
        return {
            id: productDb.id,
            displayName: productDb.displayName,
            categoryId: productDb.category && productDb.category.id,
            price: productDb.price,
            totalRating: productDb.totalRating,
            createdAt: productDb.createdAt,
            isDeleted: productDb.isDeleted,
        };
    }

    mapToDbFromCommand(productCommand: IProductCommand): Product {
        return {
            id: productCommand.id,
            displayName: productCommand.displayName,
            price: productCommand.price,
            totalRating: productCommand.totalRating,
            createdAt: productCommand.createdAt,
            isDeleted: productCommand.isDeleted,
        };
    }
}
