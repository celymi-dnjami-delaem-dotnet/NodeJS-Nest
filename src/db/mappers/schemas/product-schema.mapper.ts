import { BaseProductMapper } from '../base/base-product.mapper';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { ICreateProductSchema } from '../../mongo/types/create-product.type';
import { IProductCommand } from '../../../bl/commands/product.command';
import { IProductDbMapper } from '../types/product-mapper.type';
import { Injectable } from '@nestjs/common';
import { Product } from '../../mongo/schemas/product.schema';

@Injectable()
export class ProductSchemaMapper extends BaseProductMapper implements IProductDbMapper {
    mapCreateToDbFromCommand(createProductCommand: ICreateProductCommand): ICreateProductSchema {
        const baseProduct = super.mapCreateToDbFromCommand(createProductCommand);

        return {
            ...baseProduct,
            category: createProductCommand.categoryId,
        };
    }

    mapToCommandFromDb(productDb: Product): IProductCommand {
        const baseProduct = super.mapToCommandFromDb(productDb);

        return {
            ...baseProduct,
            id: productDb._id,
            categoryId: productDb.category && productDb.category._id,
        };
    }

    mapToDbFromCommand(productCommand: IProductCommand): Product {
        const baseProduct = super.mapToDbFromCommand(productCommand);

        return {
            ...baseProduct,
            _id: productCommand.id,
        };
    }
}
