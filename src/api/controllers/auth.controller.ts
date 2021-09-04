import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiRequest } from '../types';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../bl/services/auth.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';
import { SettingsService } from '../../settings/settings.service';
import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { TokenResultDto } from '../dto/token-result.dto';
import { UserFriendlyException } from '../../bl/exceptions/user-friendly.exception';

@ApiTags(ControllerTags.Auth)
@Controller('api/auth')
export class AuthController {
    private static readonly refreshTokenHeaderName: string = 'x-refresh-token';

    constructor(private readonly _authService: AuthService, private readonly _settingsService: SettingsService) {}

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TokenResultDto, description: 'OK' })
    async signIn(@Body() signInUser: SignInUserDto): Promise<TokenResultDto> {
        return this._authService.signIn(signInUser);
    }

    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: 'Created' })
    async signUp(@Body() signUpUser: SignUpUserDto): Promise<void> {
        return this._authService.signUp(signUpUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('renew-token')
    @ApiHeader({ name: AuthController.refreshTokenHeaderName })
    @ApiOkResponse({ type: TokenResultDto, description: 'OK' })
    async updateToken(@Req() req: ApiRequest): Promise<TokenResultDto> {
        const userId: string = req.user && req.user.userId;
        const accessToken: string = req.headers.authorization as string;
        const refreshToken: string = req.headers[AuthController.refreshTokenHeaderName] as string;

        if (!userId || !accessToken || (this._settingsService.refreshTokensEnabled && !refreshToken)) {
            throw new UserFriendlyException(ServiceResultType.InvalidData);
        }

        const accessTokenValue: string = accessToken.split(' ')[1];

        return this._authService.updateTokens(userId, accessTokenValue, refreshToken);
    }
}
