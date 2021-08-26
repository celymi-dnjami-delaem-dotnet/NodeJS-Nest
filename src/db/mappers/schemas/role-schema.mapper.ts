import { BaseRoleMapper } from '../base/base-role.mapper';
import { IRoleCommand } from '../../../bl/commands/role.command';
import { IRoleDbMapper } from '../types/role-mapper.type';
import { Injectable } from '@nestjs/common';
import { Role } from '../../mongo/schemas/role.schema';

@Injectable()
export class RoleSchemaMapper extends BaseRoleMapper implements IRoleDbMapper {
    mapToCommandFromDb(roleDb: Role): IRoleCommand {
        const baseRole = super.mapToCommandFromDb(roleDb);

        return {
            ...baseRole,
            id: roleDb._id,
        };
    }

    mapToDbFromCommand(roleCommand: IRoleCommand): Role {
        const baseRole = super.mapToDbFromCommand(roleCommand);

        return {
            ...baseRole,
            _id: roleCommand.id,
        };
    }
}
