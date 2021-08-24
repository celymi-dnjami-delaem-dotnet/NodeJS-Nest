import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtUtils } from '../utils/jwt.utils';
import { SignInUserDto } from '../../api/dto/sign-in-user.dto';
import { SignUpUserDto } from '../../api/dto/sign-up-user.dto';
import { TokenResultDto } from '../../api/dto/token-result.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserServiceAdapter } from '../../db/adapter/user-service.adapter';
import { UserUtils } from '../utils/user.utils';
import { Utils } from '../utils';

@Injectable()
export class AuthService {
    constructor(private readonly _userServiceAdapter: UserServiceAdapter, private readonly _jwtService: JwtService) {}

    async signIn(signInUser: SignInUserDto): Promise<TokenResultDto> {
        const signInUserCommand = UserMapper.mapSignInToCommandFromDto(signInUser);
        signInUserCommand.password = UserUtils.hashPassword(signInUserCommand.password);

        const { serviceResultType, exceptionMessage, data } = await this._userServiceAdapter.signInUser(
            signInUserCommand,
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        return {
            accessToken: this._jwtService.sign(JwtUtils.createJwtPayload(data)),
        };
    }

    async signUp(signUpUser: SignUpUserDto): Promise<void> {
        const signUpUserCommand = UserMapper.mapSignUpToCommandFromDto(signUpUser);
        signUpUserCommand.password = UserUtils.hashPassword(signUpUserCommand.password);

        const { serviceResultType, exceptionMessage } = await this._userServiceAdapter.signUpUser(signUpUserCommand);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);
    }
}
