import { BaseUserTokenMapper } from '../base/base-user-token.mapper';
import { ISetUserTokenCommand } from '../../../bl/commands/set-user-tokens.command';
import { ISetUserTokenDb } from '../../base-types/set-user-tokens.type';
import { IUserDbMapper, UserDbMapperName } from '../types/user-mapper.type';
import { IUserTokenCommand } from '../../../bl/commands/user-tokens-pair.command';
import { IUserTokenDbMapper } from '../types/user-token-mapper.type';
import { Inject, Injectable } from '@nestjs/common';
import { UserToken } from '../../postgres/entities/user-token.entity';

@Injectable()
export class UserTokenEntityMapper extends BaseUserTokenMapper implements IUserTokenDbMapper {
    constructor(@Inject(UserDbMapperName) private readonly _userEntityMapper: IUserDbMapper) {
        super();
    }

    mapToCommandFromDb(tokenDb: UserToken): IUserTokenCommand {
        const baseUserToken = super.mapToCommandFromDb(tokenDb);

        return {
            ...baseUserToken,
            id: tokenDb.id,
        };
    }

    mapToDbFromCommand(tokenPairCommand: IUserTokenCommand): UserToken {
        const baseUserToken = super.mapToDbFromCommand(tokenPairCommand);

        return {
            ...baseUserToken,
            id: tokenPairCommand.id,
        };
    }

    mapSetToDbFromCommand(tokenPairCommand: ISetUserTokenCommand): ISetUserTokenDb {
        const baseUserTokens = super.mapSetToDbFromCommand(tokenPairCommand);

        return {
            ...baseUserTokens,
            user: this._userEntityMapper.mapToDbFromCommand(tokenPairCommand.user),
        };
    }
}
