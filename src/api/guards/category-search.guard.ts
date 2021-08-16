import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';
import { UserFriendlyException } from '../../bl/exceptions/user-friendly.exception';

@Injectable()
export class CategorySearchGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest<Request>();

        return CategorySearchGuard.validateRequestQueryParams(req);
    }

    private static validateRequestQueryParams(request: Request): boolean {
        const includeProducts: string = request.query.includeProducts as string;
        const includeTopProducts: string = request.query.includeTopProducts as string;

        if (includeProducts && includeProducts !== 'true' && includeTopProducts !== 'false') {
            CategorySearchGuard.throwInvalidParameterException('includeProducts');
        }

        if (includeTopProducts && !Number(includeTopProducts)) {
            CategorySearchGuard.throwInvalidParameterException('includeTopProducts');
        }

        return true;
    }

    private static throwInvalidParameterException(paramName: string): void {
        throw new UserFriendlyException(ServiceResultType.InvalidData, `Invalid value of ${paramName} parameter`);
    }
}
