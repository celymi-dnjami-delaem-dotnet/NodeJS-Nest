import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../bl/services/auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';

@ApiTags(ControllerTags.Auth)
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'OK' })
    async signIn(@Body() signInUser: SignInUserDto): Promise<any> {
        return this.authService.signIn(signInUser);
    }

    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: 'Created' })
    async signUp(@Body() signUpUser: SignUpUserDto): Promise<void> {
        return this.authService.signUp(signUpUser);
    }
}
