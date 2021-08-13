import { SearchParamsProductCommand } from '../commands/in/search-params-product.command';
import { SortDirection } from '../constants';

export class ProductUtils {
    static getSearchParams(
        displayName: string,
        minRating: string,
        sortBy: string,
        price: string,
        limit: string,
        offset: string,
    ): SearchParamsProductCommand {
        let minPrice: number,
            maxPrice: number,
            sortField = 'displayName',
            sortDirection: SortDirection = SortDirection.Asc;

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
            displayName,
            minPrice,
            maxPrice,
            minRating: minRating && Number(minRating),
            sortField,
            sortDirection,
            limit: Number(limit) || 25,
            offset: Number(offset) || 0,
        };
    }
}
