import { ISetUserTokensDb } from './set-user-tokens.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserTokenRepository {
    setUserTokensPair: (tokenPair: ISetUserTokensDb) => Promise<ServiceResult>;
    removeUserTokensPair: () => Promise<ServiceResult>;
}

export const UserTokenRepositoryName = Symbol('IUserTokenRepository');
