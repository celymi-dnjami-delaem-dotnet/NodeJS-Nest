import { ProductDto } from '../../api/dto/product.dto';

export const defaultCategoryDto: ProductDto = {
    categoryId: '',
    price: 0,
    totalRating: 0,
    createdAt: undefined,
    displayName: '',
    id: '',
    isDeleted: false,
};

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export const defaultIncludeTopProductsAmount = 3;
export const defaultCollectionLimit = 25;
export const defaultCollectionOffset = 0;
export const defaultProductsSortField = 'displayName';
export const defaultProductsSortDirection: SortDirection = SortDirection.Asc;
