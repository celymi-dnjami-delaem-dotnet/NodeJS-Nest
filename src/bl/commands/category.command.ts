import { IProductCommand } from './product.command';

export interface ICategoryCommand {
    id: string;
    displayName: string;
    products: IProductCommand[];
    createdAt: Date;
    isDeleted: boolean;
}
