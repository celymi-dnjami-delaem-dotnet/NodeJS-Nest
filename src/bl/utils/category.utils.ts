import { ISearchParamsCategoryCommand } from '../commands/search-params-category.command';
import { defaultIncludeTopProductsAmount } from '../constants';

export class CategoryUtils {
    static getSearchParamsForCategory(
        includeProducts?: string,
        includeTopProducts?: string,
    ): ISearchParamsCategoryCommand {
        return {
            includeProducts: includeProducts === 'true',
            includeTopProducts: includeTopProducts ? Number(includeTopProducts) : defaultIncludeTopProductsAmount,
        };
    }
}
