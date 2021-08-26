import { BaseProductMapper } from '../base/base-product.mapper';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { ICreateProductEntity } from '../../postgres/types/create-product.type';
import { IProductCommand } from '../../../bl/commands/product.command';
import { IProductDbMapper } from '../types/product-mapper.type';
import { Injectable } from '@nestjs/common';
import { Product } from '../../postgres/entities/product.entity';

@Injectable()
export class ProductEntityMapper extends BaseProductMapper implements IProductDbMapper {
    mapCreateToDbFromCommand(createProductCommand: ICreateProductCommand): ICreateProductEntity {
        const baseProduct = super.mapCreateToDbFromCommand(createProductCommand);

        return {
            ...baseProduct,
            categoryId: createProductCommand.categoryId,
        };
    }

    mapToCommandFromDb(productDb: Product): IProductCommand {
        const baseProduct = super.mapToCommandFromDb(productDb);

        return {
            ...baseProduct,
            categoryId: productDb.category && productDb.category.id,
        };
    }

    mapToDbFromCommand(productCommand: IProductCommand): Product {
        const baseProduct = super.mapToDbFromCommand(productCommand);

        return {
            ...baseProduct,
            id: productCommand.id,
        };
    }
}
