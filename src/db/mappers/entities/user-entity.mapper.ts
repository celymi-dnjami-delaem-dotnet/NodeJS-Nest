import { BaseUserMapper } from '../base/base-user.mapper';
import { IUserCommand } from '../../../bl/commands/user.command';
import { IUserDbMapper } from '../types/user-mapper.type';
import { Injectable } from '@nestjs/common';
import { User } from '../../postgres/entities/user.entity';

@Injectable()
export class UserEntityMapper extends BaseUserMapper implements IUserDbMapper {
    mapToCommandFromDb(userDb: User): IUserCommand {
        const baseMap = super.mapToCommandFromDb(userDb);

        return {
            ...baseMap,
            id: userDb.id,
            roles:
                userDb.roles && userDb.roles.length
                    ? userDb.roles.map((x) => ({
                          id: x.id,
                          displayName: x.displayName,
                      }))
                    : [],
        };
    }

    mapToDbFromCommand(userCommand: IUserCommand): User {
        const baseMap = super.mapToDbFromCommand(userCommand);

        return {
            ...baseMap,
            id: userCommand.id,
        };
    }
}
