import { IAuthUserCommand } from '../../../bl/commands/auth-user.command';
import { IBaseUser } from '../../base-types/base-user.type';
import { ICreateUserCommand } from '../../../bl/commands/create-user.command';
import { ICreateUserDb } from '../../base-types/create-user.type';
import { ISignInDb } from '../../base-types/sign-in.type';
import { IUserCommand } from '../../../bl/commands/user.command';

export interface IUserDbMapper {
    mapToCommandFromDb: (userDb: IBaseUser) => IUserCommand;
    mapToDbFromCommand: (userCommand: IUserCommand) => IBaseUser;
    mapCreateToDbFromCommand: (createCommand: ICreateUserCommand) => ICreateUserDb;
    mapSignInToDbFromCommand: (signInCommand: IAuthUserCommand) => ISignInDb;
}

export const UserDbMapperName = Symbol('IUserDbMapper');
