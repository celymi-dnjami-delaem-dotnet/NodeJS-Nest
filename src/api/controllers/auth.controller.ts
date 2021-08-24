import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../bl/services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';

@ApiTags(ControllerTags.Auth)
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    async signIn(@Body() signInUser: SignInUserDto): Promise<any> {
        return this.authService.signIn(signInUser);
    }

    @Post('sign-up')
    async signUp(@Body() signUpUser: SignUpUserDto): Promise<any> {
        return this.authService.signUp(signUpUser);
    }
}
