import { IBaseProduct } from '../../base-types/base-product.type';
import { ICreateProduct } from '../../base-types/create-product.type';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { IProductCommand } from '../../../bl/commands/product.command';
import { IProductDbMapper } from '../types/product-mapper.type';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { ISearchParamsProductCommand } from '../../../bl/commands/search-params-product.command';

export abstract class BaseProductMapper implements IProductDbMapper {
    mapSearchParamsToDbFromCommand(searchParams: ISearchParamsProductCommand): ISearchParamsProduct {
        return {
            displayName: searchParams.displayName,
            minPrice: searchParams.minPrice,
            maxPrice: searchParams.maxPrice,
            minRating: searchParams.minRating,
            sortDirection: searchParams.sortDirection,
            sortField: searchParams.sortField,
            limit: searchParams.limit,
            offset: searchParams.offset,
        };
    }

    mapCreateToDbFromCommand(createProductCommand: ICreateProductCommand): ICreateProduct {
        return {
            displayName: createProductCommand.displayName,
            price: createProductCommand.price,
        };
    }

    mapToCommandFromDb(productDb: IBaseProduct): IProductCommand {
        return {
            displayName: productDb.displayName,
            price: productDb.price,
            totalRating: productDb.totalRating,
            createdAt: productDb.createdAt,
            isDeleted: productDb.isDeleted,
        };
    }

    mapToDbFromCommand(productCommand: IProductCommand): IBaseProduct {
        return {
            displayName: productCommand.displayName,
            price: productCommand.price,
            totalRating: productCommand.totalRating,
            createdAt: productCommand.createdAt,
            isDeleted: productCommand.isDeleted,
        };
    }
}
