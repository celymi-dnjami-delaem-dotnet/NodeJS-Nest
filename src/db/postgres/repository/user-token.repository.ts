import { IBaseUserToken } from '../../base-types/base-user-token.type';
import { ISetUserTokenDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenRepository } from '../../base-types/user-token-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../entities/user.entity';
import { UserToken } from '../entities/user-token.entity';
import { getOldRefreshTokenDate } from '../../constants';

@Injectable()
export class UserTokenTypeOrmRepository implements IUserTokenRepository {
    constructor(@InjectRepository(UserToken) private readonly _userTokenRepository: Repository<UserToken>) {}

    async userTokenExist(accessToken: string, refreshToken: string): Promise<ServiceResult<IBaseUserToken>> {
        const foundResult = await this._userTokenRepository.findOne({ accessToken, refreshToken });
        if (!foundResult) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success, foundResult);
    }

    async updateUserToken({ id, accessToken, refreshToken }: UserToken): Promise<ServiceResult> {
        const updatedResult = await this._userTokenRepository.update({ id }, { accessToken, refreshToken });
        if (!updatedResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async createUserToken({ refreshToken, accessToken, user }: ISetUserTokenDb): Promise<ServiceResult> {
        const userTokenEntity = new UserToken();
        userTokenEntity.accessToken = accessToken;
        userTokenEntity.refreshToken = refreshToken;
        userTokenEntity.user = user as User;

        await this._userTokenRepository.save(userTokenEntity);

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeUserToken(): Promise<ServiceResult> {
        await this._userTokenRepository.delete({
            updatedAt: LessThan(getOldRefreshTokenDate(new Date())),
        });

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeAllUserTokens(): Promise<ServiceResult> {
        const removeResult = await this._userTokenRepository.createQueryBuilder().delete().from(UserToken).execute();

        if (!removeResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
