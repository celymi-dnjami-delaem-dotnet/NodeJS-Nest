import { CreateUserDto } from '../../api/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { ServiceResult } from '../result-wrappers/service-result';
import { UserDto } from '../../api/dto/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserServiceAdapter } from '../../db/adapter/user-service.adapter';
import { Utils } from '../utils';

@Injectable()
export class UserService {
    constructor(private readonly _userServiceAdapter: UserServiceAdapter) {}

    async getUsers(): Promise<UserDto[]> {
        const users = await this._userServiceAdapter.getUsers();

        return users.map(UserMapper.mapToDtoFromCommand);
    }

    async getUserById(id: string): Promise<UserDto> {
        const { serviceResultType, exceptionMessage, data } = await this._userServiceAdapter.getUserById(id);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return UserMapper.mapToDtoFromCommand(data);
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        const creationResult = await this._userServiceAdapter.createUser(
            UserMapper.mapCreateToCommandFromDto(createUserDto),
        );

        return UserMapper.mapToDtoFromCommand(creationResult);
    }

    async updateUser(userDto: UserDto): Promise<UserDto> {
        const { serviceResultType, exceptionMessage, data } = await this._userServiceAdapter.updateUser(
            UserMapper.mapToCommandFromDto(userDto),
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return UserMapper.mapToDtoFromCommand(data);
    }

    async softRemoveUser(id: string): Promise<void> {
        await UserService.handleRemoveUser(id, this._userServiceAdapter.softRemoveUser);
    }

    async removeUser(id: string): Promise<void> {
        await UserService.handleRemoveUser(id, this._userServiceAdapter.removeUser);
    }

    private static async handleRemoveUser(id: string, callback: (id: string) => Promise<ServiceResult>): Promise<void> {
        const { serviceResultType, exceptionMessage } = await callback(id);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);
    }
}
