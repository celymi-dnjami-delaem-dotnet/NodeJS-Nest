import { IUserCommand } from '../commands/user.command';

export class JwtUtils {
    static createJwtPayload(user: IUserCommand) {
        return {
            sub: user.id,
            username: user.userName,
            roles: user.roles && user.roles.length ? user.roles.map((x) => x.displayName).join(',') : '',
        };
    }
}
