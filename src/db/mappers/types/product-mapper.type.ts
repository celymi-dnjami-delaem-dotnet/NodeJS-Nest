import { CreateProductCommand } from '../../../bl/commands/in/create-product.command';
import { IBaseDb } from '../../base-types/base-db.type';
import { ICreateProduct } from '../../base-types/create-product.type';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { ProductCommand } from '../../../bl/commands/out/product.command';
import { SearchParamsProductCommand } from '../../../bl/commands/in/search-params-product.command';

export interface IProductDbMapper {
    mapSearchParamsToDbFromCommand: (searchParams: SearchParamsProductCommand) => ISearchParamsProduct;
    mapToCommandFromDb: (productDb: IBaseDb) => ProductCommand;
    mapToDbFromCommand: (productCommand: ProductCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createProductCommand: CreateProductCommand) => ICreateProduct;
}

export const ProductDbMapperName = Symbol('IProductDbMapper');
