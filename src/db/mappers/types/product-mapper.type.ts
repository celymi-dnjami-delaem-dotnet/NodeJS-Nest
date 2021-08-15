import { IBaseDb } from '../../base-types/base-db.type';
import { ICreateProduct } from '../../base-types/create-product.type';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { IProductCommand } from '../../../bl/commands/product.command';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { SearchParamsProductCommand } from '../../../bl/commands/in/search-params-product.command';

export interface IProductDbMapper {
    mapSearchParamsToDbFromCommand: (searchParams: SearchParamsProductCommand) => ISearchParamsProduct;
    mapToCommandFromDb: (productDb: IBaseDb) => IProductCommand;
    mapToDbFromCommand: (productCommand: IProductCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createProductCommand: ICreateProductCommand) => ICreateProduct;
}

export const ProductDbMapperName = Symbol('IProductDbMapper');
