import { ISetUserTokenDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenRepository } from '../../base-types/user-token-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../schemas/user.schema';
import { UserToken, UserTokenDocument } from '../schemas/user-token.schema';
import { getOldRefreshTokenDate } from '../../constants';

@Injectable()
export class UserTokenMongooseRepository implements IUserTokenRepository {
    constructor(@InjectModel(UserToken.name) private readonly _userTokenModel: Model<UserTokenDocument>) {}

    async userTokenExist(accessToken: string, refreshToken: string): Promise<ServiceResult<UserToken>> {
        const foundResult = await this._userTokenModel.findOne({ accessToken, refreshToken }).exec();
        if (!foundResult) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success, foundResult);
    }

    async updateUserToken({ _id, accessToken, refreshToken }: UserToken): Promise<ServiceResult> {
        const updatedResult = await this._userTokenModel
            .updateOne(
                { _id },
                {
                    $set: {
                        refreshToken,
                        accessToken,
                        updatedAt: new Date(),
                    },
                },
            )
            .exec();

        if (!updatedResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async createUserToken({ user, refreshToken, accessToken }: ISetUserTokenDb): Promise<ServiceResult> {
        const userTokenSchema = new this._userTokenModel();
        userTokenSchema.accessToken = accessToken;
        userTokenSchema.refreshToken = refreshToken;
        userTokenSchema.user = user as User;

        await userTokenSchema.save();

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeUserToken(): Promise<ServiceResult> {
        await this._userTokenModel
            .deleteMany({
                updatedAt: {
                    $lt: getOldRefreshTokenDate(new Date()),
                },
            })
            .exec();

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeAllUserTokens(): Promise<ServiceResult> {
        const removeResult = await this._userTokenModel.deleteMany().exec();

        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
