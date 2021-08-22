import { IBaseRole } from './base-role.type';
import { ICreateRoleDb } from './create-role.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IRoleRepository {
    getRoles: (limit: number, offset: number) => Promise<IBaseRole[]>;
    getRoleById: (id: string) => Promise<ServiceResult<IBaseRole>>;
    createRole: (createRole: ICreateRoleDb) => Promise<IBaseRole>;
    updateRole: (role: IBaseRole) => Promise<ServiceResult<IBaseRole>>;
    softRemoveRole: (id: string) => Promise<ServiceResult>;
    removeRole: (id: string) => Promise<ServiceResult>;
}

export const RoleRepositoryName = Symbol('IRoleRepository');
