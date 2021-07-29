import { ServiceResultType } from './service-result-type';

export class ServiceResult<T = void> {
    serviceResultType: ServiceResultType;
    data: T;
    exceptionMessage: string;

    constructor(result: ServiceResultType, data?: T, exceptionMessage?: string) {
        this.serviceResultType = result;
        this.data = data;
        this.exceptionMessage = exceptionMessage;
    }
}
