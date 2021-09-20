import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
    constructor(private readonly _roles: string[]) {
        super();
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(_, user) {
        const { roles } = user;
        if (!roles || !roles.length) {
            throw new UnauthorizedException();
        }

        if (!(roles as string[]).some((x) => this._roles.some((y) => y === x))) {
            throw new ForbiddenException();
        }

        return user;
    }
}
