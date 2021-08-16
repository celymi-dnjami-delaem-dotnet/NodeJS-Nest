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
