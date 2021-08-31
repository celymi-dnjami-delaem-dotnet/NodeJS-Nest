import { ICollectionSearchCommand } from './collection-search.command';
import { SortDirection } from '../constants';

export interface ISearchParamsProductCommand extends ICollectionSearchCommand {
    displayName?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    sortField: string;
    sortDirection: SortDirection;
}
