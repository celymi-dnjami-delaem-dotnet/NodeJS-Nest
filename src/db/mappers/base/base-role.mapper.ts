import { IBaseRole } from '../../base-types/base-role.type';
import { ICreateRoleCommand } from '../../../bl/commands/create-role.command';
import { ICreateRoleDb } from '../../base-types/create-role.type';
import { IRoleCommand } from '../../../bl/commands/role.command';
import { IRoleDbMapper } from '../types/role-mapper.type';

export abstract class BaseRoleMapper implements IRoleDbMapper {
    mapCreateToDbFromCommand(createRoleCommand: ICreateRoleCommand): ICreateRoleDb {
        return {
            displayName: createRoleCommand.displayName,
        };
    }

    mapToCommandFromDb(roleDb: IBaseRole): IRoleCommand {
        return {
            displayName: roleDb.displayName,
            createdAt: roleDb.createdAt,
            isDeleted: roleDb.isDeleted,
        };
    }

    mapToDbFromCommand(roleCommand: IRoleCommand): IBaseRole {
        return {
            displayName: roleCommand.displayName,
            createdAt: roleCommand.createdAt,
            isDeleted: roleCommand.isDeleted,
        };
    }
}
