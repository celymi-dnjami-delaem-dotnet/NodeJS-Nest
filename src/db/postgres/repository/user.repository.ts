import { DefaultRoles } from '../../../bl/constants';
import { FindConditions, Repository } from 'typeorm';
import { IBaseUser } from 'src/db/base-types/base-user.type';
import { ICreateUserDb } from '../../base-types/create-user.type';
import { ISignInDb } from 'src/db/base-types/sign-in.type';
import { IUserRepository } from '../../base-types/user-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../entities/user.entity';
import { missingRoleEntityExceptionMessage, missingUserEntityExceptionMessage } from '../../constants';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
    constructor(
        @InjectRepository(User) private readonly _userRepository: Repository<User>,
        @InjectRepository(Role) private readonly _roleRepository: Repository<Role>,
    ) {}

    async getUsers(limit: number, offset: number): Promise<User[]> {
        return this._userRepository.find({ take: limit, skip: offset, relations: ['roles'] });
    }

    async getUserById(id: string): Promise<ServiceResult<User>> {
        const foundResult = await this.findUserById(id, true);

        if (!foundResult) {
            return new ServiceResult<User>(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult<User>(ServiceResultType.Success, foundResult);
    }

    async signInUser(signInUser: ISignInDb): Promise<ServiceResult<IBaseUser>> {
        const foundResult = await this._userRepository.findOne({
            userName: signInUser.userName,
            password: signInUser.password,
        });

        if (!foundResult) {
            return new ServiceResult<User>(ServiceResultType.InvalidData, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult<User>(ServiceResultType.Success, foundResult);
    }

    async signUpUser(createUserDb: ICreateUserDb): Promise<ServiceResult<IBaseUser>> {
        return this.handleUserCreation(createUserDb, { displayName: DefaultRoles.Buyer });
    }

    async createUser(createUserDb: ICreateUserDb): Promise<ServiceResult<User>> {
        return this.handleUserCreation(createUserDb, createUserDb.roleId && { id: createUserDb.roleId });
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

        return this.getUserById(userId);
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

    async removeAllUsers(): Promise<ServiceResult> {
        const removeResult = await this._userRepository.createQueryBuilder().delete().from(User).execute();

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private async findUserById(id: string, includeChildren?: boolean): Promise<User> {
        return this._userRepository.findOne(id, includeChildren ? { relations: ['roles'] } : {});
    }

    private async handleUserCreation(
        createUser: ICreateUserDb,
        searchRoleCondition: FindConditions<Role>,
    ): Promise<ServiceResult<User>> {
        let existingRole: Role;
        if (searchRoleCondition) {
            existingRole = await this._roleRepository.findOne(searchRoleCondition);

            if (!existingRole) {
                return new ServiceResult<User>(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
            }
        }

        const newUser = new User();
        newUser.userName = createUser.userName;
        newUser.firstName = createUser.firstName;
        newUser.lastName = createUser.lastName;
        newUser.password = createUser.password;

        if (searchRoleCondition) {
            newUser.roles = [existingRole];
        }

        const createdUser = await this._userRepository.save(newUser);

        return new ServiceResult<User>(ServiceResultType.Success, createdUser);
    }
}
