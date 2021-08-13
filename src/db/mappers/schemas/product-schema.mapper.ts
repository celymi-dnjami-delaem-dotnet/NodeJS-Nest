import { CreateProductCommand } from '../../../bl/commands/in/create-product.command';
import { ICreateProductSchema } from '../../mongo/types/create-product.type';
import { IProductDbMapper } from '../types/product-mapper.type';
import { ISearchParamsProduct } from 'src/db/base-types/search-params-product.type';
import { Injectable } from '@nestjs/common';
import { Product } from '../../mongo/schemas/product.schema';
import { ProductCommand } from '../../../bl/commands/out/product.command';
import { SearchParamsProductCommand } from 'src/bl/commands/in/search-params-product.command';

@Injectable()
export class ProductSchemaMapper implements IProductDbMapper {
    mapSearchParamsToDbFromCommand(searchParams: SearchParamsProductCommand): ISearchParamsProduct {
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
