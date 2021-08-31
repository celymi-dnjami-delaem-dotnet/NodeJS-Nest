import { CreateRoleDto } from '../../api/dto/create-role.dto';
import { ICreateRoleCommand } from '../commands/create-role.command';
import { IRoleCommand } from '../commands/role.command';
import { RoleDto } from '../../api/dto/role.dto';

export class RoleMapper {
    static mapCreateToCommandFromDto(createRole: CreateRoleDto): ICreateRoleCommand {
        return {
            displayName: createRole.displayName,
        };
    }

    static mapToCommandFromDto(role: RoleDto): IRoleCommand {
        return {
            id: role.id,
            displayName: role.displayName,
            createdAt: role.createdAt,
            isDeleted: role.isDeleted,
        };
    }

    static mapToDtoFromCommand(roleCommand: IRoleCommand): RoleDto {
        return {
            id: roleCommand.id,
            displayName: roleCommand.displayName,
            createdAt: roleCommand.createdAt,
            isDeleted: roleCommand.isDeleted,
        };
    }
}
