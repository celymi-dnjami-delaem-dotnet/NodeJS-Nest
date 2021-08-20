import { ICreateUserDb } from '../../base-types/create-user.type';
import { IUserRepository } from '../../base-types/user-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../entities/user.entity';
import { missingUserEntityExceptionMessage } from '../../constants';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
    constructor(@InjectRepository(User) private readonly _userRepository: Repository<User>) {}

    async getUsers(): Promise<User[]> {
        return this._userRepository.find();
    }

    async getUserById(id: string): Promise<ServiceResult<User>> {
        const foundResult = await this.findUserById(id);

        if (!foundResult) {
            return new ServiceResult<User>(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult<User>(ServiceResultType.Success, foundResult);
    }

    async createUser(createUser: ICreateUserDb): Promise<User> {
        const newUser = new User();
        newUser.firstName = createUser.firstName;
        newUser.lastName = createUser.lastName;
        newUser.password = createUser.password;

        return await this._userRepository.save(newUser);
    }

    async updateUser(user: User): Promise<ServiceResult<User>> {
        const userId: string = user.id;

        const updatedResult = await this._userRepository.update(userId, {
            firstName: user.firstName,
            lastName: user.lastName,
        });
        if (!updatedResult.affected) {
            return new ServiceResult<User>(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        const updatedUser = await this.findUserById(userId);

        return new ServiceResult<User>(ServiceResultType.Success, updatedUser);
    }

    async softRemoveUser(id: string): Promise<ServiceResult> {
        const removeResult = await this._userRepository.update({ id }, { isDeleted: true });

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeUser(id: string): Promise<ServiceResult> {
        const removeResult = await this._userRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private findUserById(id: string): Promise<User> {
        return this._userRepository.findOne(id);
    }
}
