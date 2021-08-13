import { CreateProductCommand } from '../../../bl/commands/in/create-product.command';
import { ICreateProductEntity } from '../../postgres/types/create-product.type';
import { IProductDbMapper } from '../types/product-mapper.type';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { Injectable } from '@nestjs/common';
import { Product } from '../../postgres/entities/product.entity';
import { ProductCommand } from '../../../bl/commands/out/product.command';
import { SearchParamsProductCommand } from '../../../bl/commands/in/search-params-product.command';

@Injectable()
export class ProductEntityMapper implements IProductDbMapper {
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

    mapCreateToDbFromCommand(createProductCommand: CreateProductCommand): ICreateProductEntity {
        return {
            displayName: createProductCommand.displayName,
            price: createProductCommand.price,
            categoryId: createProductCommand.categoryId,
        };
    }

    mapToCommandFromDb(productDb: Product): ProductCommand {
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

    mapToDbFromCommand(productCommand: ProductCommand): Product {
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
