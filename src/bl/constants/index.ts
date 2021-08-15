import { CategoryDto } from '../../api/dto/category.dto';

export const defaultCategoryDto: CategoryDto = {
    createdAt: undefined,
    displayName: '',
    id: '',
    isDeleted: false,
    products: [],
};

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}
