import { Injectable } from '@nestjs/common';
import { SignInUserDto } from '../../api/dto/sign-in-user.dto';
import { SignUpUserDto } from '../../api/dto/sign-up-user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserServiceAdapter } from '../../db/adapter/user-service.adapter';
import { UserUtils } from '../utils/user.utils';
import { Utils } from '../utils';

@Injectable()
export class AuthService {
    constructor(private readonly _userServiceAdapter: UserServiceAdapter) {}

    async signIn(signInUser: SignInUserDto): Promise<any> {
        const signInUserCommand = UserMapper.mapSignInToCommandFromDto(signInUser);
        signInUserCommand.password = UserUtils.hashPassword(signInUserCommand.password);

        const { serviceResultType, exceptionMessage } = await this._userServiceAdapter.signInUser(signInUserCommand);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);
    }

    async signUp(signUpUser: SignUpUserDto): Promise<void> {
        const signUpUserCommand = UserMapper.mapSignUpToCommandFromDto(signUpUser);
        signUpUserCommand.password = UserUtils.hashPassword(signUpUserCommand.password);

        const { serviceResultType, exceptionMessage } = await this._userServiceAdapter.signUpUser(signUpUserCommand);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);
    }
}
