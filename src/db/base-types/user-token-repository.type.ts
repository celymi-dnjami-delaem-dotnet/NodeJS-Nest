import { IBaseUserToken } from './base-user-token.type';
import { ISetUserTokenDb } from './set-user-tokens.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserTokenRepository {
    userTokenExist: (accessToken: string, refreshToken: string) => Promise<ServiceResult<IBaseUserToken>>;
    createUserToken: (token: ISetUserTokenDb) => Promise<ServiceResult>;
    updateUserToken: (token: IBaseUserToken) => Promise<ServiceResult>;
    removeUserToken: () => Promise<ServiceResult>;
    removeAllUserTokens: () => Promise<ServiceResult>;
}

export const UserTokenRepositoryName = Symbol('IUserTokenRepository');
