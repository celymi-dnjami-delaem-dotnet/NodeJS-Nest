import { IUserCommand } from './user.command';

export interface ISetUserTokenCommand {
    user: IUserCommand;
    accessToken: string;
    refreshToken: string;
}
