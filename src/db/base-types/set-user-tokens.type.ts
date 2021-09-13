import { IBaseUser } from './base-user.type';

export interface ISetUserTokenDb {
    user?: IBaseUser;
    accessToken: string;
    refreshToken: string;
}
