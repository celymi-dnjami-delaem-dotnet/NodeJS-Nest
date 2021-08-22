import { BaseRoleMapper } from '../base/base-role.mapper';
import { ICreateRoleCommand } from '../../../bl/commands/create-role.command';
import { ICreateRoleDb } from '../../base-types/create-role.type';
import { IRoleCommand } from '../../../bl/commands/role.command';
import { IRoleDbMapper } from '../types/role-mapper.type';
import { Injectable } from '@nestjs/common';
import { Role } from '../../postgres/entities/role.entity';

@Injectable()
export class RoleEntityMapper extends BaseRoleMapper implements IRoleDbMapper {
    mapCreateToDbFromCommand(createRoleCommand: ICreateRoleCommand): ICreateRoleDb {
        return super.mapCreateToDbFromCommand(createRoleCommand);
    }

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
