import { ServiceResultType } from './service-result-type';

export class ServiceResult<T = void> {
    private _serviceResultType: ServiceResultType;
    private _data: T;
    private _exceptionMessage: string;

    constructor(result: ServiceResultType, data?: T, exceptionMessage?: string) {
        this._serviceResultType = result;
        this._data = data;
        this._exceptionMessage = exceptionMessage;
    }

    set serviceResultType(value: ServiceResultType) {
        this._serviceResultType = value;
    }

    get serviceResultType(): ServiceResultType {
        return this._serviceResultType;
    }

    set data(value: T) {
        this._data = value;
    }

    get data(): T {
        return this._data;
    }

    set exceptionMessage(value: string) {
        this._exceptionMessage = value;
    }

    get exceptionMessage(): string {
        return this._exceptionMessage;
    }
}
