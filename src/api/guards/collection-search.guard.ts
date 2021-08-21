import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';
import { UserFriendlyException } from '../../bl/exceptions/user-friendly.exception';

@Injectable()
export class CollectionSearchGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        return CollectionSearchGuard.validateSearchParameters(req);
    }

    private static validateSearchParameters(request: Request): boolean {
        const limit: string = request.query.limit as string;
        const offset: string = request.query.offset as string;

        if (limit) {
            CollectionSearchGuard.validateNumericParameter('limit', limit);
        }

        if (offset) {
            CollectionSearchGuard.validateNumericParameter('offset', offset);
        }

        return true;
    }

    private static validateNumericParameter(param: string, value: string): void {
        const numberValue = Number(value);

        if (!numberValue || numberValue < 0) {
            throw new UserFriendlyException(ServiceResultType.InvalidData, `${param} has incorrect value`);
        }
    }
}
