import { ISetUserTokensCommand } from '../../../bl/commands/set-user-tokens.command';
import { ISetUserTokensDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenDbMapper } from '../types/user-token-mapper.type';

export abstract class BaseUserTokenMapper implements IUserTokenDbMapper {
    mapSetPairToDbFromCommand(tokenPairCommand: ISetUserTokensCommand): ISetUserTokensDb {
        return {
            accessToken: tokenPairCommand.accessToken,
            refreshToken: tokenPairCommand.refreshToken,
        };
    }
}
