import { BaseUserTokenMapper } from '../base/base-user-token.mapper';
import { ISetUserTokensCommand } from '../../../bl/commands/set-user-tokens.command';
import { ISetUserTokensDb } from '../../base-types/set-user-tokens.type';
import { IUserDbMapper, UserDbMapperName } from '../types/user-mapper.type';
import { IUserTokenDbMapper } from '../types/user-token-mapper.type';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserTokenEntityMapper extends BaseUserTokenMapper implements IUserTokenDbMapper {
    constructor(@Inject(UserDbMapperName) private readonly _userEntityMapper: IUserDbMapper) {
        super();
    }

    mapSetPairToDbFromCommand(tokenPairCommand: ISetUserTokensCommand): ISetUserTokensDb {
        const baseUserTokens = super.mapSetPairToDbFromCommand(tokenPairCommand);

        return {
            ...baseUserTokens,
            user: this._userEntityMapper.mapToDbFromCommand(tokenPairCommand.user),
        };
    }
}
