import { ISetUserTokensCommand } from '../../../bl/commands/set-user-tokens.command';
import { ISetUserTokensDb } from '../../base-types/set-user-tokens.type';

export interface IUserTokenDbMapper {
    mapSetPairToDbFromCommand: (tokenPairCommand: ISetUserTokensCommand) => ISetUserTokensDb;
}

export const UserTokenDbMapperName = Symbol('IUserTokenDbMapper');
