import { BaseUserMapper } from '../base/base-user.mapper';
import { ICreateUserCommand } from '../../../bl/commands/create-user.command';
import { ICreateUserDb } from '../../base-types/create-user.type';
import { IUserCommand } from '../../../bl/commands/user.command';
import { IUserDbMapper } from '../types/user-mapper.type';
import { Injectable } from '@nestjs/common';
import { User } from '../../mongo/schemas/user.schema';

@Injectable()
export class UserSchemaMapper extends BaseUserMapper implements IUserDbMapper {
    mapCreateToDbFromCommand(createCommand: ICreateUserCommand): ICreateUserDb {
        return super.mapCreateToDbFromCommand(createCommand);
    }

    mapToCommandFromDb(userDb: User): IUserCommand {
        return {
            ...super.mapToCommandFromDb(userDb),
            id: userDb._id,
        };
    }

    mapToDbFromCommand(userCommand: IUserCommand): User {
        return { ...super.mapToDbFromCommand(userCommand), _id: userCommand.id };
    }
}