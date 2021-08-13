import { IBaseDb } from '../../base-types/base-db.type';
import { ICreateProduct } from '../../base-types/create-product.type';
import { ICreateProductCommand } from '../../../bl/commands/create-product.command';
import { IProductCommand } from '../../../bl/commands/product.command';

export interface IProductDbMapper {
    mapToCommandFromDb: (productDb: IBaseDb) => IProductCommand;
    mapToDbFromCommand: (productCommand: IProductCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createProductCommand: ICreateProductCommand) => ICreateProduct;
}

export const ProductDbMapperName = Symbol('IProductDbMapper');
