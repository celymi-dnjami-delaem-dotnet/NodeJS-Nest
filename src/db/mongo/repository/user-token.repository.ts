import { ISetUserTokensDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenRepository } from '../../base-types/user-token-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../schemas/user.schema';
import { UserToken, UserTokenDocument } from '../schemas/user-token.schema';

@Injectable()
export class UserTokenMongooseRepository implements IUserTokenRepository {
    constructor(@InjectModel(UserToken.name) private readonly _userTokenModel: Model<UserTokenDocument>) {}

    async setUserTokensPair({ user, refreshToken, accessToken }: ISetUserTokensDb): Promise<ServiceResult> {
        const userTokenSchema = new this._userTokenModel();
        userTokenSchema.accessToken = accessToken;
        userTokenSchema.refreshToken = refreshToken;
        userTokenSchema.user = user as User;

        await userTokenSchema.save();

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeUserTokensPair(): Promise<ServiceResult> {
        //const removeResult = await this._userTokenModel.remove({ updatedAt: { $eq } });

        return Promise.resolve(undefined);
    }
}
