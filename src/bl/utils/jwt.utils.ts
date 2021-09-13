import { IUserCommand } from '../commands/user.command';
import { randomBytes } from 'crypto';

export class JwtUtils {
    static createJwtPayload(user: IUserCommand) {
        return {
            sub: user.id,
            username: user.userName,
            roles: user.roles && user.roles.length ? user.roles.map((x) => x.displayName).join(',') : '',
        };
    }

    static createRefreshToken(): string {
        return randomBytes(64).toString('hex');
    }
}
