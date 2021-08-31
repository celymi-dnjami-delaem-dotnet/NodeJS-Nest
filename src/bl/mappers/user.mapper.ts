import { CreateUserDto } from '../../api/dto/create-user.dto';
import { IAuthUserCommand } from '../commands/auth-user.command';
import { ICreateUserCommand } from '../commands/create-user.command';
import { IUserCommand } from '../commands/user.command';
import { SignInUserDto } from '../../api/dto/sign-in-user.dto';
import { SignUpUserDto } from '../../api/dto/sign-up-user.dto';
import { UserDto, UserRoleDto } from '../../api/dto/user.dto';

export class UserMapper {
    static mapCreateToCommandFromDto(createUserDto: CreateUserDto): ICreateUserCommand {
        return {
            username: createUserDto.userName,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            password: createUserDto.password,
            roleId: createUserDto.roleId,
        };
    }

    static mapSignUpToCommandFromDto(signUpUser: SignUpUserDto): ICreateUserCommand {
        return {
            username: signUpUser.userName,
            firstName: signUpUser.firstName,
            lastName: signUpUser.lastName,
            password: signUpUser.password,
        };
    }

    static mapSignInToCommandFromDto(signInUser: SignInUserDto): IAuthUserCommand {
        return {
            userName: signInUser.userName,
            password: signInUser.password,
        };
    }

    static mapToCommandFromDto(userDto: UserDto): IUserCommand {
        return {
            id: userDto.id,
            userName: userDto.userName,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            createdAt: userDto.createdAt,
            isDeleted: userDto.isDeleted,
        };
    }

    static mapToDtoFromCommand(userCommand: IUserCommand): UserDto {
        return {
            id: userCommand.id,
            roles:
                userCommand.roles && userCommand.roles.length
                    ? userCommand.roles.map(
                          (x) =>
                              ({
                                  id: x.id,
                                  displayName: x.displayName,
                              } as UserRoleDto),
                      )
                    : [],
            userName: userCommand.userName,
            firstName: userCommand.firstName,
            lastName: userCommand.lastName,
            createdAt: userCommand.createdAt,
            isDeleted: userCommand.isDeleted,
        };
    }
}
