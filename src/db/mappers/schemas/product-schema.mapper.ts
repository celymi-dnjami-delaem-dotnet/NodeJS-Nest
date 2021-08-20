import { BaseProductMapper } from '../base/base-product.mapper';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { ICreateProductSchema } from '../../mongo/types/create-product.type';
import { IProductCommand } from '../../../bl/commands/product.command';
import { IProductDbMapper } from '../types/product-mapper.type';
import { ISearchParamsProduct } from 'src/db/base-types/search-params-product.type';
import { ISearchParamsProductCommand } from 'src/bl/commands/search-params-product.command';
import { Injectable } from '@nestjs/common';
import { Product } from '../../mongo/schemas/product.schema';

@Injectable()
export class ProductSchemaMapper extends BaseProductMapper implements IProductDbMapper {
    mapSearchParamsToDbFromCommand(searchParams: ISearchParamsProductCommand): ISearchParamsProduct {
        return super.mapSearchParamsToDbFromCommand(searchParams);
    }

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
