import { IBaseUser } from './base-user.type';

export interface ISetUserTokensDb {
    user?: IBaseUser;
    accessToken: string;
    refreshToken: string;
}
