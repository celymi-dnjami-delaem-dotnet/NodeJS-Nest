import { IBaseUser } from './base-user.type';
import { ICreateUserDb } from './create-user.type';
import { ISignInDb } from './sign-in.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserRepository {
    getUsers: (limit: number, offset: number) => Promise<IBaseUser[]>;
    getUserById: (id: string) => Promise<ServiceResult<IBaseUser>>;
    signInUser: (signInUser: ISignInDb) => Promise<ServiceResult<IBaseUser>>;
    signUpUser: (user: ICreateUserDb) => Promise<ServiceResult<IBaseUser>>;
    createUser: (user: ICreateUserDb) => Promise<ServiceResult<IBaseUser>>;
    updateUser: (user: IBaseUser) => Promise<ServiceResult<IBaseUser>>;
    softRemoveUser: (id: string) => Promise<ServiceResult>;
    removeUser: (id: string) => Promise<ServiceResult>;
}

export const UserRepositoryName = Symbol('IUserRepository');
