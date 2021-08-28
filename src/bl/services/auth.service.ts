import { ISetUserTokensCommand } from '../commands/set-user-tokens.command';
import { IUserServiceAdapter, UserServiceAdapterName } from '../../db/adapter/user-service.adapter';
import { IUserTokenServiceAdapter, UserTokenServiceAdapterName } from '../../db/adapter/user-token-service.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtUtils } from '../utils/jwt.utils';
import { SignInUserDto } from '../../api/dto/sign-in-user.dto';
import { SignUpUserDto } from '../../api/dto/sign-up-user.dto';
import { TokenResultDto } from '../../api/dto/token-result.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserUtils } from '../utils/user.utils';
import { Utils } from '../utils';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserServiceAdapterName) private readonly _userServiceAdapter: IUserServiceAdapter,
        @Inject(UserTokenServiceAdapterName) private readonly _userTokenServiceAdapter: IUserTokenServiceAdapter,
        private readonly _jwtService: JwtService,
    ) {}

    async signIn(signInUser: SignInUserDto): Promise<TokenResultDto> {
        const signInUserCommand = UserMapper.mapSignInToCommandFromDto(signInUser);
        signInUserCommand.password = UserUtils.hashPassword(signInUserCommand.password);

        const { serviceResultType, exceptionMessage, data } = await this._userServiceAdapter.signInUser(
            signInUserCommand,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        const accessToken = this._jwtService.sign(JwtUtils.createJwtPayload(data));
        const refreshToken = JwtUtils.createRefreshToken();

        const tokenPairCommand: ISetUserTokensCommand = { accessToken, refreshToken, user: data };
        await this._userTokenServiceAdapter.setUserTokensPair(tokenPairCommand);

        return {
            accessToken,
            refreshToken,
        };
    }

    async signUp(signUpUser: SignUpUserDto): Promise<void> {
        const signUpUserCommand = UserMapper.mapSignUpToCommandFromDto(signUpUser);
        signUpUserCommand.password = UserUtils.hashPassword(signUpUserCommand.password);

        const { serviceResultType, exceptionMessage } = await this._userServiceAdapter.signUpUser(signUpUserCommand);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);
    }
}
