import { SortDirection } from '../../constants';

export class SearchParamsProductCommand {
    displayName?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    sortField: string;
    sortDirection: SortDirection;
    limit: number;
    offset: number;
}
