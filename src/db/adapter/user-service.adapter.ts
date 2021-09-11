import { IAuthUserCommand } from '../../bl/commands/auth-user.command';
import { IBaseUser } from '../base-types/base-user.type';
import { ICollectionSearchCommand } from '../../bl/commands/collection-search.command';
import { ICreateUserCommand } from '../../bl/commands/create-user.command';
import { ICreateUserDb } from '../base-types/create-user.type';
import { IUserCommand } from '../../bl/commands/user.command';
import { IUserDbMapper, UserDbMapperName } from '../mappers/types/user-mapper.type';
import { IUserRepository, UserRepositoryName } from '../base-types/user-repository.type';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserServiceAdapter {
    getUsers: (collectionSearchCommand: ICollectionSearchCommand) => Promise<IUserCommand[]>;
    getUserById: (id: string) => Promise<ServiceResult<IUserCommand>>;
    signInUser: (signInCommand: IAuthUserCommand) => Promise<ServiceResult<IUserCommand>>;
    signUpUser: (createUserCommand: ICreateUserCommand) => Promise<ServiceResult<IUserCommand>>;
    createUser: (createUserCommand: ICreateUserCommand) => Promise<ServiceResult<IUserCommand>>;
    updateUser: (userCommand: IUserCommand) => Promise<ServiceResult<IUserCommand>>;
    softRemoveUser: (id: string) => Promise<ServiceResult>;
    removeUser: (id: string) => Promise<ServiceResult>;
    removeAllUsers: () => Promise<ServiceResult>;
}

export const UserServiceAdapterName = Symbol('IUserServiceAdapter');

@Injectable()
export class UserServiceAdapter implements IUserServiceAdapter {
    constructor(
        @Inject(UserRepositoryName) private readonly _userRepository: IUserRepository,
        @Inject(UserDbMapperName) private readonly _userMapper: IUserDbMapper,
    ) {}

    async getUsers({ limit, offset }: ICollectionSearchCommand): Promise<IUserCommand[]> {
        const users = await this._userRepository.getUsers(limit, offset);

        return users.map((x) => this._userMapper.mapToCommandFromDb(x));
    }

    async getUserById(id: string): Promise<ServiceResult<IUserCommand>> {
        const { serviceResultType, exceptionMessage, data } = await this._userRepository.getUserById(id);

        return new ServiceResult<IUserCommand>(
            serviceResultType,
            data && this._userMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async signInUser(signInCommand: IAuthUserCommand): Promise<ServiceResult<IUserCommand>> {
        const signInUserDb = this._userMapper.mapSignInToDbFromCommand(signInCommand);

        const { serviceResultType, exceptionMessage, data } = await this._userRepository.signInUser(signInUserDb);

        return new ServiceResult<IUserCommand>(
            serviceResultType,
            data && this._userMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async signUpUser(createUserCommand: ICreateUserCommand): Promise<ServiceResult<IUserCommand>> {
        return this.handleUserCreationAdapter(createUserCommand, (...args) => this._userRepository.signUpUser(...args));
    }

    async createUser(createUserCommand: ICreateUserCommand): Promise<ServiceResult<IUserCommand>> {
        return this.handleUserCreationAdapter(createUserCommand, (...args) => this._userRepository.createUser(...args));
    }

    async updateUser(userCommand: IUserCommand): Promise<ServiceResult<IUserCommand>> {
        const dbUser = this._userMapper.mapToDbFromCommand(userCommand);

        const { serviceResultType, exceptionMessage, data } = await this._userRepository.updateUser(dbUser);

        return new ServiceResult<IUserCommand>(
            serviceResultType,
            data && this._userMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async softRemoveUser(id: string): Promise<ServiceResult> {
        return this._userRepository.softRemoveUser(id);
    }

    async removeUser(id: string): Promise<ServiceResult> {
        return this._userRepository.removeUser(id);
    }

    async removeAllUsers(): Promise<ServiceResult> {
        return this._userRepository.removeAllUsers();
    }

    private async handleUserCreationAdapter(
        createUserCommand: ICreateUserCommand,
        callback: (dbUser: ICreateUserDb) => Promise<ServiceResult<IBaseUser>>,
    ): Promise<ServiceResult<IUserCommand>> {
        const dbUser = this._userMapper.mapCreateToDbFromCommand(createUserCommand);

        const { serviceResultType, exceptionMessage, data } = await callback(dbUser);

        return new ServiceResult<IUserCommand>(
            serviceResultType,
            data && this._userMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }
}
