import { IBaseUserToken } from '../../base-types/base-user-token.type';
import { ISetUserTokenCommand } from '../../../bl/commands/set-user-tokens.command';
import { ISetUserTokenDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenCommand } from '../../../bl/commands/user-tokens-pair.command';

export interface IUserTokenDbMapper {
    mapToCommandFromDb: (tokenDb: IBaseUserToken) => IUserTokenCommand;
    mapToDbFromCommand: (tokenPairCommand: IUserTokenCommand) => IBaseUserToken;
    mapSetToDbFromCommand: (tokenPairCommand: ISetUserTokenCommand) => ISetUserTokenDb;
}

export const UserTokenDbMapperName = Symbol('IUserTokenDbMapper');
