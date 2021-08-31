import { ICreateRoleDb } from '../../base-types/create-role.type';
import { IRoleRepository } from '../../base-types/role-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User, UserDocument } from '../schemas/user.schema';
import { missingRoleEntityExceptionMessage } from '../../constants';

@Injectable()
export class RoleMongooseRepository implements IRoleRepository {
    constructor(
        @InjectModel(Role.name) private readonly _roleModel: Model<RoleDocument>,
        @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    ) {}

    async getRoles(limit: number, offset: number): Promise<Role[]> {
        return this._roleModel.find().lean().skip(offset).limit(limit).exec();
    }

    async getRoleById(id: string): Promise<ServiceResult<Role>> {
        const foundRole = await this.findRoleById(id, true);
        if (!foundRole) {
            return new ServiceResult<Role>(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return new ServiceResult<Role>(ServiceResultType.Success, foundRole);
    }

    async createRole(newRole: ICreateRoleDb): Promise<Role> {
        const roleSchema = new this._roleModel(newRole);

        return roleSchema.save();
    }

    async updateRole(role: Role): Promise<ServiceResult<Role>> {
        const updateResult = await this._roleModel.updateOne(
            { _id: role._id },
            { $set: { displayName: role.displayName } },
        );
        if (!updateResult.nModified) {
            return new ServiceResult<Role>(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        const updatedRole = await this.findRoleById(role._id, true);

        return new ServiceResult<Role>(ServiceResultType.Success, updatedRole);
    }

    async grantRole(roleId: string, userId: string): Promise<ServiceResult> {
        const { serviceResultType, exceptionMessage } = await this.findRoleAndUserByIds(roleId, userId);
        if (serviceResultType !== ServiceResultType.Success) {
            return new ServiceResult(serviceResultType, null, exceptionMessage);
        }

        await this._userModel.updateOne({ _id: userId }, { $push: { roles: roleId } }).exec();
        await this._roleModel.updateOne({ _id: roleId }, { $push: { users: userId } }).exec();

        return new ServiceResult(ServiceResultType.Success);
    }

    async revokeRole(roleId: string, userId: string): Promise<ServiceResult> {
        const { serviceResultType, exceptionMessage } = await this.findRoleAndUserByIds(roleId, userId);
        if (serviceResultType !== ServiceResultType.Success) {
            return new ServiceResult(serviceResultType, null, exceptionMessage);
        }

        await this._userModel.updateOne({ _id: userId }, { $pull: { roles: roleId } }).exec();
        await this._roleModel.updateOne({ _id: roleId }, { $pull: { users: userId } }).exec();

        return new ServiceResult(ServiceResultType.Success);
    }

    async softRemoveRole(id: string): Promise<ServiceResult> {
        const removeResult = await this._roleModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
        if (!removeResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeRole(id: string): Promise<ServiceResult> {
        const removeResult = await this._roleModel.remove({ _id: id });
        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingRoleEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private async findRoleById(id: string, includeChildren?: boolean): Promise<Role> {
        return includeChildren
            ? this._roleModel.findOne({ _id: id }).populate('users').exec()
            : this._roleModel.findOne({ _id: id }).exec();
    }

    private async findRoleAndUserByIds(roleId: string, userId: string): Promise<ServiceResult> {
        const existingRole = await this.findRoleById(roleId);
        if (!existingRole) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        const existingUser = await this._userModel.findOne({ _id: userId }).exec();
        if (!existingUser) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
