import { IBaseRole } from '../../base-types/base-role.type';
import { ICreateRoleDb } from '../../base-types/create-role.type';
import { IRoleRepository } from '../../base-types/role-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { missingRoleEntityExceptionMessage } from '../../constants';

@Injectable()
export class RoleTypeOrmRepository implements IRoleRepository {
    constructor(@InjectRepository(Role) private readonly _roleRepository: Repository<Role>) {}

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

        const updatedRole = await this.findRoleById(role.id);

        return new ServiceResult<IBaseRole>(ServiceResultType.Success, updatedRole);
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

    private findRoleById(id: string, includeChildren?: boolean): Promise<Role> {
        return this._roleRepository.findOne(id, includeChildren ? { relations: ['users'] } : {});
    }
}
