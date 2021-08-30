import { IBaseUserToken } from './base-user-token.type';
import { ISetUserTokenDb } from './set-user-tokens.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserTokenRepository {
    userTokensPairExist: (accessToken: string, refreshToken: string) => Promise<ServiceResult<IBaseUserToken>>;
    createUserTokensPair: (tokenPair: ISetUserTokenDb) => Promise<ServiceResult>;
    updateUserTokensPair: (tokenPair: IBaseUserToken) => Promise<ServiceResult>;
    removeUserTokensPair: () => Promise<ServiceResult>;
}

export const UserTokenRepositoryName = Symbol('IUserTokenRepository');
