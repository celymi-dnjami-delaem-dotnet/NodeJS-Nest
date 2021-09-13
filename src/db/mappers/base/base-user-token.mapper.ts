import { IBaseUserToken } from '../../base-types/base-user-token.type';
import { ISetUserTokenCommand } from '../../../bl/commands/set-user-tokens.command';
import { ISetUserTokenDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenCommand } from '../../../bl/commands/user-tokens-pair.command';
import { IUserTokenDbMapper } from '../types/user-token-mapper.type';

export abstract class BaseUserTokenMapper implements IUserTokenDbMapper {
    mapToCommandFromDb(tokenDb: IBaseUserToken): IUserTokenCommand {
        return {
            accessToken: tokenDb.accessToken,
            refreshToken: tokenDb.refreshToken,
            updatedAt: tokenDb.updatedAt,
            createdAt: tokenDb.createdAt,
            isDeleted: tokenDb.isDeleted,
        };
    }

    mapToDbFromCommand(tokenPairCommand: IUserTokenCommand): IBaseUserToken {
        return {
            accessToken: tokenPairCommand.accessToken,
            refreshToken: tokenPairCommand.refreshToken,
            updatedAt: tokenPairCommand.updatedAt,
            createdAt: tokenPairCommand.createdAt,
            isDeleted: tokenPairCommand.isDeleted,
        };
    }

    mapSetToDbFromCommand(tokenPairCommand: ISetUserTokenCommand): ISetUserTokenDb {
        return {
            accessToken: tokenPairCommand.accessToken,
            refreshToken: tokenPairCommand.refreshToken,
        };
    }
}
