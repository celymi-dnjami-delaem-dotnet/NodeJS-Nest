import { IBaseUser } from '../../base-types/base-user.type';
import { ICreateUserCommand } from '../../../bl/commands/create-user.command';
import { ICreateUserDb } from '../../base-types/create-user.type';
import { IUserCommand } from '../../../bl/commands/user.command';

export interface IUserDbMapper {
    mapToCommandFromDb: (userDb: IBaseUser) => IUserCommand;
    mapToDbFromCommand: (userCommand: IUserCommand) => IBaseUser;
    mapCreateToDbFromCommand: (createCommand: ICreateUserCommand) => ICreateUserDb;
}

export const UserDbMapperName = Symbol('IUserDbMapper');
