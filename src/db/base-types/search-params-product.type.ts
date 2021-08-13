import { SortDirection } from '../../bl/constants';

export interface ISearchParamsProduct {
    displayName: string;
    minRating: number;
    minPrice: number;
    maxPrice: number;
    sortField: string;
    sortDirection: SortDirection;
    limit: number;
    offset: number;
}
