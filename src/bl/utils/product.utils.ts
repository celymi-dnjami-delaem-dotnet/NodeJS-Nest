import { ISearchParamsProductCommand } from '../commands/search-params-product.command';
import { SortDirection, defaultProductsSortDirection, defaultProductsSortField } from '../constants';
import { Utils } from './index';

export class ProductUtils {
    static getSearchParams(
        displayName?: string,
        minRating?: string,
        sortBy?: string,
        price?: string,
        limit?: string,
        offset?: string,
    ): ISearchParamsProductCommand {
        let minPrice: number,
            maxPrice: number,
            sortField = defaultProductsSortField,
            sortDirection: SortDirection = defaultProductsSortDirection;

        if (sortBy) {
            const sortOptions = sortBy.split(':');
            sortField = sortOptions[0];
            sortDirection = sortOptions[1] as SortDirection;
        }

        if (price) {
            const priceOptions = price.split(':');
            minPrice = Number(priceOptions[0]);
            maxPrice = Number(priceOptions[1]);
        }

        return {
            ...Utils.getCollectionSearchParameters(limit, offset),
            displayName,
            minPrice,
            maxPrice,
            minRating: minRating && Number(minRating),
            sortField,
            sortDirection,
        };
    }
}
