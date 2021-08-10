import { ProductCommand } from './product.command';

export class CategoryCommand {
    id: string;
    displayName: string;
    products: ProductCommand[];
    createdAt: Date;
    isDeleted: boolean;
}
