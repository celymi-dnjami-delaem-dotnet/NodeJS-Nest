import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../bl/services/auth.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { Request } from 'express';
import { ServiceResultType } from '../../bl/result-wrappers/service-result-type';
import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { TokenResultDto } from '../dto/token-result.dto';
import { UserFriendlyException } from '../../bl/exceptions/user-friendly.exception';

@ApiTags(ControllerTags.Auth)
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TokenResultDto, description: 'OK' })
    async signIn(@Body() signInUser: SignInUserDto): Promise<TokenResultDto> {
        return this.authService.signIn(signInUser);
    }

    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: 'Created' })
    async signUp(@Body() signUpUser: SignUpUserDto): Promise<void> {
        return this.authService.signUp(signUpUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('renew-token')
    @ApiHeader({ name: 'x-refresh-token' })
    @ApiOkResponse({ type: TokenResultDto, description: 'OK' })
    async updateToken(@Req() req: Request): Promise<TokenResultDto> {
        const userId: string = (req as any).user && (req as any).user.userId;
        const accessToken: string = req.headers.authorization as string;
        const refreshToken: string = req.headers['x-refresh-token'] as string;

        if (!userId || !accessToken || !refreshToken) {
            throw new UserFriendlyException(ServiceResultType.InvalidData);
        }

        return this.authService.updateTokens(userId, accessToken.split(' ')[1], refreshToken);
    }
}
