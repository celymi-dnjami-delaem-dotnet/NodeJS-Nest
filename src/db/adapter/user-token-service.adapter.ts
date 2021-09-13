import { ISetUserTokenCommand } from '../../bl/commands/set-user-tokens.command';
import { IUserTokenCommand } from '../../bl/commands/user-tokens-pair.command';
import { IUserTokenDbMapper, UserTokenDbMapperName } from '../mappers/types/user-token-mapper.type';
import { IUserTokenRepository, UserTokenRepositoryName } from '../base-types/user-token-repository.type';
import { Inject } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IUserTokenServiceAdapter {
    userTokenExists: (accessToken: string, refreshToken: string) => Promise<ServiceResult<IUserTokenCommand>>;
    updateUserToken: (tokenPairCommand: IUserTokenCommand) => Promise<ServiceResult>;
    createUserToken: (tokenPairCommand: ISetUserTokenCommand) => Promise<ServiceResult>;
    removeUserToken: () => Promise<ServiceResult>;
}

export const UserTokenServiceAdapterName = Symbol('IUserTokenServiceAdapter');

export class UserTokenServiceAdapter implements IUserTokenServiceAdapter {
    constructor(
        @Inject(UserTokenRepositoryName) private readonly _userTokenRepository: IUserTokenRepository,
        @Inject(UserTokenDbMapperName) private readonly _userTokenMapper: IUserTokenDbMapper,
    ) {}

    async userTokenExists(accessToken: string, refreshToken: string): Promise<ServiceResult<IUserTokenCommand>> {
        const { serviceResultType, exceptionMessage, data } = await this._userTokenRepository.userTokenExist(
            accessToken,
            refreshToken,
        );

        return new ServiceResult<IUserTokenCommand>(
            serviceResultType,
            data && this._userTokenMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async createUserToken(tokenPairCommand: ISetUserTokenCommand): Promise<ServiceResult> {
        const mappedUserTokenPair = this._userTokenMapper.mapSetToDbFromCommand(tokenPairCommand);

        return this._userTokenRepository.createUserToken(mappedUserTokenPair);
    }

    async updateUserToken(tokenPairCommand: IUserTokenCommand): Promise<ServiceResult> {
        const mappedUserTokenPair = this._userTokenMapper.mapToDbFromCommand(tokenPairCommand);

        return this._userTokenRepository.updateUserToken(mappedUserTokenPair);
    }

    async removeUserToken(): Promise<ServiceResult> {
        return this._userTokenRepository.removeUserToken();
    }
}
