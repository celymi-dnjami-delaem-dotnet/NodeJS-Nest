import { BaseProductMapper } from '../base/base-product.mapper';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { ICreateProductEntity } from '../../postgres/types/create-product.type';
import { IProductCommand } from '../../../bl/commands/product.command';
import { IProductDbMapper } from '../types/product-mapper.type';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { ISearchParamsProductCommand } from '../../../bl/commands/search-params-product.command';
import { Injectable } from '@nestjs/common';
import { Product } from '../../postgres/entities/product.entity';

@Injectable()
export class ProductEntityMapper extends BaseProductMapper implements IProductDbMapper {
    mapSearchParamsToDbFromCommand(searchParams: ISearchParamsProductCommand): ISearchParamsProduct {
        return super.mapSearchParamsToDbFromCommand(searchParams);
    }

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
