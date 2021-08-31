import { IBaseRole } from '../../base-types/base-role.type';
import { ICreateRoleCommand } from '../../../bl/commands/create-role.command';
import { ICreateRoleDb } from '../../base-types/create-role.type';
import { IRoleCommand } from '../../../bl/commands/role.command';

export interface IRoleDbMapper {
    mapToCommandFromDb: (roleDb: IBaseRole) => IRoleCommand;
    mapToDbFromCommand: (roleCommand: IRoleCommand) => IBaseRole;
    mapCreateToDbFromCommand: (createRoleCommand: ICreateRoleCommand) => ICreateRoleDb;
}

export const RoleDbMapperName = Symbol('IRoleDbMapper');
