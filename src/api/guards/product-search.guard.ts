import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';
import { SortDirection, defaultCategoryDto } from '../../bl/constants';
import { UserFriendlyException } from '../../bl/exceptions/user-friendly.exception';

@Injectable()
export class ProductSearchGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        return ProductSearchGuard.validateSearchParams(request);
    }

    private static validateSearchParams(request: Request): boolean {
        const minRating: string = request.query.minRating as string;
        const price: string = request.query.price as string;
        const sortBy: string = request.query.sortBy as string;

        if (minRating && Number(minRating) > 10) {
            ProductSearchGuard.throwInvalidParameterException('minRating');
        }

        if (price) {
            const priceOptions = price.split(':');
            if (!priceOptions.length || priceOptions.length > 2) {
                ProductSearchGuard.throwInvalidParameterException('price');
            }

            const [minValue, maxValue] = priceOptions;

            if ((minValue && !Number(minValue)) || !Number(maxValue)) {
                ProductSearchGuard.throwInvalidParameterException('price');
            }
        }

        if (sortBy) {
            const sortOptions = sortBy.split(':');
            if (!sortOptions.length || sortOptions.length > 2) {
                ProductSearchGuard.throwInvalidParameterException('sort');
            }

            const [fieldName, direction] = sortOptions;

            if (!(fieldName in defaultCategoryDto)) {
                ProductSearchGuard.throwInvalidParameterException('sort');
            }

            if (!Object.values(SortDirection).includes(direction as SortDirection)) {
                ProductSearchGuard.throwInvalidParameterException('sort');
            }
        }

        return true;
    }

    private static throwInvalidParameterException(paramName: string): void {
        throw new UserFriendlyException(ServiceResultType.InvalidData, `Invalid value of ${paramName} parameter`);
    }
}
