import { CreateProductCommand } from '../../../bl/commands/in/create-product.command';
import { IBaseDb } from '../../types/base-db.type';
import { ICreateProduct } from '../../types/create-product.type';
import { ProductCommand } from '../../../bl/commands/out/product.command';

export interface IProductMapper {
    mapToCommandFromDb: (productDb: IBaseDb) => ProductCommand;
    mapToDbFromCommand: (productCommand: ProductCommand) => IBaseDb;
    mapCreateToDbFromCommand: (createProductCommand: CreateProductCommand) => ICreateProduct;
}

export const ProductMapperName = Symbol('IProductMapper');
