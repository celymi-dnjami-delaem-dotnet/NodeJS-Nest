import { ISetUserTokensCommand } from '../../bl/commands/set-user-tokens.command';
import { IUserTokenDbMapper, UserTokenDbMapperName } from '../mappers/types/user-token-mapper.type';
import { IUserTokenRepository, UserTokenRepositoryName } from '../base-types/user-token-repository.type';
import { Inject } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserTokenServiceAdapter {
    setUserTokensPair: (tokenPairCommand: ISetUserTokensCommand) => Promise<ServiceResult>;
    removeUserTokensPair: () => Promise<ServiceResult>;
}

export const UserTokenServiceAdapterName = Symbol('IUserTokenServiceAdapter');

export class UserTokenServiceAdapter implements IUserTokenServiceAdapter {
    constructor(
        @Inject(UserTokenRepositoryName) private readonly _userTokenRepository: IUserTokenRepository,
        @Inject(UserTokenDbMapperName) private readonly _userTokenMapper: IUserTokenDbMapper,
    ) {}

    async setUserTokensPair(tokenPairCommand: ISetUserTokensCommand): Promise<ServiceResult> {
        const mappedUserTokenPair = this._userTokenMapper.mapSetPairToDbFromCommand(tokenPairCommand);

        return this._userTokenRepository.setUserTokensPair(mappedUserTokenPair);
    }

    async removeUserTokensPair(): Promise<ServiceResult> {
        return this._userTokenRepository.removeUserTokensPair();
    }
}
