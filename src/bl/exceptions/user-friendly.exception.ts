import { ServiceResultType } from '../result-wrappers/service-result-type';

export class UserFriendlyException extends Error {
    readonly serviceResultType: ServiceResultType;
    readonly exceptionMessage: string;

    constructor(serviceResultType: ServiceResultType, exceptionMessage?: string) {
        super();

        this.serviceResultType = serviceResultType;
        this.exceptionMessage = exceptionMessage;
    }
}
