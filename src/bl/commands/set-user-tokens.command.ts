import { IUserCommand } from './user.command';

export interface ISetUserTokensCommand {
    user: IUserCommand;
    accessToken: string;
    refreshToken: string;
}
