import { IBaseRole } from '../../base-types/base-role.type';
import { ICreateRoleDb } from '../../base-types/create-role.type';
import { IRoleRepository } from '../../base-types/role-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../entities/user.entity';
import { missingRoleEntityExceptionMessage } from '../../constants';

@Injectable()
export class RoleTypeOrmRepository implements IRoleRepository {
    constructor(
        @InjectRepository(Role) private readonly _roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly _userRepository: Repository<User>,
    ) {}

    async getRoles(limit: number, offset: number): Promise<IBaseRole[]> {
        return this._roleRepository.find({ take: limit, skip: offset });
    }

    async getRoleById(id: string): Promise<ServiceResult<IBaseRole>> {
        const foundRole = await this.findRoleById(id, true);
        if (!foundRole) {
            return new ServiceResult<IBaseRole>(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return new ServiceResult<IBaseRole>(ServiceResultType.Success, foundRole);
    }

    async getRoleByName(name: string): Promise<ServiceResult<IBaseRole>> {
        const foundRole = await this._roleRepository.findOne({ displayName: name });
        if (!foundRole) {
            return new ServiceResult<IBaseRole>(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return new ServiceResult<IBaseRole>(ServiceResultType.Success, foundRole);
    }

    async createRole(createRole: ICreateRoleDb): Promise<IBaseRole> {
        const newRole = new Role();
        newRole.displayName = createRole.displayName;

        return await this._roleRepository.save(newRole);
    }

    async updateRole(role: Role): Promise<ServiceResult<IBaseRole>> {
        const updateResult = await this._roleRepository.update({ id: role.id }, { displayName: role.displayName });
        if (!updateResult.affected) {
            return new ServiceResult<IBaseRole>(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return this.getRoleById(role.id);
    }

    async grantRole(roleId: string, userId: string): Promise<ServiceResult> {
        const { serviceResultType, exceptionMessage, data } = await this.findRoleAndUserByIds(roleId, userId);
        if (serviceResultType !== ServiceResultType.Success) {
            return new ServiceResult(serviceResultType, null, exceptionMessage);
        }

        await this._roleRepository.createQueryBuilder().relation('users').of(data.role).add(data.user);

        return new ServiceResult(ServiceResultType.Success);
    }

    async revokeRole(roleId: string, userId: string): Promise<ServiceResult> {
        const { serviceResultType, exceptionMessage, data } = await this.findRoleAndUserByIds(roleId, userId);
        if (serviceResultType !== ServiceResultType.Success) {
            return new ServiceResult(serviceResultType, null, exceptionMessage);
        }

        await this._roleRepository.createQueryBuilder().relation('users').of(data.role).remove(data.user);

        return new ServiceResult(ServiceResultType.Success);
    }

    async softRemoveRole(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this._roleRepository.update(id, { isDeleted: true });
        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeRole(id: string): Promise<ServiceResult> {
        const removeResult = await this._roleRepository.delete(id);

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeAllRoles(): Promise<ServiceResult> {
        const removeResult = await this._roleRepository.createQueryBuilder().delete().from(Role).execute();

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private findRoleById(id: string, includeChildren?: boolean): Promise<Role> {
        return this._roleRepository.findOne(id, includeChildren ? { relations: ['users'] } : {});
    }

    private async findRoleAndUserByIds(
        roleId: string,
        userId: string,
    ): Promise<ServiceResult<{ role: Role; user: User }>> {
        const existingRole = await this.findRoleById(roleId);
        if (!existingRole) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        const existingUser = await this._userRepository.findOne(userId);
        if (!existingUser) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success, { role: existingRole, user: existingUser });
    }
}
