import { SortDirection } from '../constants';

export interface ISearchParamsProductCommand {
    displayName?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    sortField: string;
    sortDirection: SortDirection;
    limit: number;
    offset: number;
}
