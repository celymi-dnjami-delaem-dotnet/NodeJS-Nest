import { BaseRoleMapper } from '../base/base-role.mapper';
import { IRoleCommand } from '../../../bl/commands/role.command';
import { IRoleDbMapper } from '../types/role-mapper.type';
import { Injectable } from '@nestjs/common';
import { Role } from '../../postgres/entities/role.entity';

@Injectable()
export class RoleEntityMapper extends BaseRoleMapper implements IRoleDbMapper {
    mapToCommandFromDb(roleDb: Role): IRoleCommand {
        const baseRole = super.mapToCommandFromDb(roleDb);

        return {
            ...baseRole,
            id: roleDb.id,
        };
    }

    mapToDbFromCommand(roleCommand: IRoleCommand): Role {
        const baseRole = super.mapToDbFromCommand(roleCommand);

        return {
            ...baseRole,
            id: roleCommand.id,
        };
    }
}
