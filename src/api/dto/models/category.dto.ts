import { ProductDto } from './product.dto';

export class CategoryDto {
    id?: string;
    displayName: string;
    createdAt?: Date;
    isDeleted?: boolean;
    products: ProductDto[];
}
