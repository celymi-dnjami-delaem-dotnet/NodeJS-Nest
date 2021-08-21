import { ICollectionSearchCommand } from '../commands/collection-search.command';
import { ServiceResultType } from '../result-wrappers/service-result-type';
import { UserFriendlyException } from '../exceptions/user-friendly.exception';
import { defaultCollectionLimit, defaultCollectionOffset } from '../constants';

export class Utils {
    static validateServiceResultType(serviceResultType: ServiceResultType, exceptionMessage?: string): void {
        if (serviceResultType !== ServiceResultType.Success) {
            throw new UserFriendlyException(serviceResultType, exceptionMessage);
        }
    }

    static getCollectionSearchParameters(limit?: string, offset?: string): ICollectionSearchCommand {
        return {
            limit: Number(limit) || defaultCollectionLimit,
            offset: Number(offset) || defaultCollectionOffset,
        };
    }
}
