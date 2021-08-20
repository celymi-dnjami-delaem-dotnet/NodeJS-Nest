import { IBaseUser } from './base-user.type';
import { ICreateUserDb } from './create-user.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserRepository {
    getUsers: () => Promise<IBaseUser[]>;
    getUserById: (id: string) => Promise<ServiceResult<IBaseUser>>;
    createUser: (user: ICreateUserDb) => Promise<IBaseUser>;
    updateUser: (user: IBaseUser) => Promise<ServiceResult<IBaseUser>>;
    softRemoveUser: (id: string) => Promise<ServiceResult>;
    removeUser: (id: string) => Promise<ServiceResult>;
}

export const UserRepositoryName = Symbol('IUserRepository');
