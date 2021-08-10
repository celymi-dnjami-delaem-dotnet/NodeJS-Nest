import { CreateProductCommand } from '../../../bl/commands/in/create-product.command';
import { IBaseDb } from '../../base-types/base-db.type';
import { ICreateProduct } from '../../base-types/create-product.type';
import { ProductCommand } from '../../../bl/commands/out/product.command';

export interface IProductDbMapper {
    mapToCommandFromDb: (productDb: IBaseDb) => ProductCommand;
    mapToDbFromCommand: (productCommand: ProductCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createProductCommand: CreateProductCommand) => ICreateProduct;
}

export const ProductDbMapperName = Symbol('IProductDbMapper');
