import { IUserServiceAdapter, UserServiceAdapterName } from '../../db/adapter/user-service.adapter';
import { IUserTokenServiceAdapter, UserTokenServiceAdapterName } from '../../db/adapter/user-token-service.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtUtils } from '../utils/jwt.utils';
import { SettingsService } from '../../settings/settings.service';
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
        private readonly _settingsService: SettingsService,
    ) {}

    async updateTokens(userId: string, accessToken: string, refreshToken: string): Promise<TokenResultDto> {
        const foundUserToken = await this._userTokenServiceAdapter.userTokenExists(accessToken, refreshToken);
        Utils.validateServiceResultType(foundUserToken.serviceResultType, foundUserToken.exceptionMessage);

        const foundUser = await this._userServiceAdapter.getUserById(userId);
        Utils.validateServiceResultType(foundUser.serviceResultType, foundUser.exceptionMessage);

        const newAccessToken = this._jwtService.sign(JwtUtils.createJwtPayload(foundUser.data));
        let newRefreshToken: string;

        if (this._settingsService.refreshTokensEnabled) {
            newRefreshToken = JwtUtils.createRefreshToken();

            await this._userTokenServiceAdapter.updateUserToken({
                id: foundUserToken.data.id,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        }

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async signIn(signInUser: SignInUserDto): Promise<TokenResultDto> {
        const signInUserCommand = UserMapper.mapSignInToCommandFromDto(signInUser);
        signInUserCommand.password = UserUtils.hashPassword(signInUserCommand.password);

        const { serviceResultType, exceptionMessage, data } = await this._userServiceAdapter.signInUser(
            signInUserCommand,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        const accessToken = this._jwtService.sign(JwtUtils.createJwtPayload(data));
        let refreshToken: string;

        if (this._settingsService.refreshTokensEnabled) {
            refreshToken = JwtUtils.createRefreshToken();

            await this._userTokenServiceAdapter.createUserToken({ accessToken, refreshToken, user: data });
        }

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
