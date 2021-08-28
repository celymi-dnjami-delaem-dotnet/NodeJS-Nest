import { ISetUserTokensDb } from '../../base-types/set-user-tokens.type';
import { IUserTokenRepository } from '../../base-types/user-token-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { UserToken } from '../entities/user-token.entity';

@Injectable()
export class UserTokenTypeOrmRepository implements IUserTokenRepository {
    constructor(@InjectRepository(UserToken) private readonly _userTokenRepository: Repository<UserToken>) {}

    setUserTokensPair(tokenPair: ISetUserTokensDb): Promise<ServiceResult> {
        console.log(tokenPair);

        return Promise.resolve(undefined);
    }

    removeUserTokensPair(): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }
}
