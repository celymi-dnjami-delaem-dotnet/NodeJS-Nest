import { ISetUserTokensDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenRepository } from '../../base-types/user-token-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../entities/user.entity';
import { UserToken } from '../entities/user-token.entity';

@Injectable()
export class UserTokenTypeOrmRepository implements IUserTokenRepository {
    constructor(@InjectRepository(UserToken) private readonly _userTokenRepository: Repository<UserToken>) {}

    async setUserTokensPair({ refreshToken, accessToken, user }: ISetUserTokensDb): Promise<ServiceResult> {
        const userTokenEntity = new UserToken();
        userTokenEntity.accessToken = accessToken;
        userTokenEntity.refreshToken = refreshToken;
        userTokenEntity.user = user as User;

        await this._userTokenRepository.save(userTokenEntity);

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeUserTokensPair(): Promise<ServiceResult> {
        const currentDate = new Date();

        await this._userTokenRepository.delete({
            updatedAt: LessThan(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getUTCDate()),
            ),
        });

        return new ServiceResult(ServiceResultType.Success);
    }
}
