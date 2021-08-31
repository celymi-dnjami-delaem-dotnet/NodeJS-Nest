import { IBaseProduct } from '../../base-types/base-product.type';
import { ICreateProduct } from '../../base-types/create-product.type';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { IProductCommand } from '../../../bl/commands/product.command';
import { ISearchParamsProduct } from '../../base-types/search-params-product.type';
import { ISearchParamsProductCommand } from '../../../bl/commands/search-params-product.command';

export interface IProductDbMapper {
    mapSearchParamsToDbFromCommand: (searchParams: ISearchParamsProductCommand) => ISearchParamsProduct;
    mapToCommandFromDb: (productDb: IBaseProduct) => IProductCommand;
    mapToDbFromCommand: (productCommand: IProductCommand) => IBaseProduct;
    mapCreateToDbFromCommand: (createProductCommand: ICreateProductCommand) => ICreateProduct;
}

export const ProductDbMapperName = Symbol('IProductDbMapper');
