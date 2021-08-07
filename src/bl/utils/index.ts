import { ServiceResultType } from '../result-wrappers/service-result-type';
import { UserFriendlyException } from '../exceptions/user-friendly.exception';

export class Utils {
    static validateServiceResultType(serviceResultType: ServiceResultType, exceptionMessage?: string): void {
        if (serviceResultType !== ServiceResultType.Success) {
            throw new UserFriendlyException(serviceResultType, exceptionMessage);
        }
    }
}
