import { CreateUserDto } from '../../api/dto/create-user.dto';
import { ICreateUserCommand } from '../commands/create-user.command';
import { IUserCommand } from '../commands/user.command';
import { UserDto, UserRoleDto } from '../../api/dto/user.dto';

export class UserMapper {
    static mapCreateToCommandFromDto(createUserDto: CreateUserDto): ICreateUserCommand {
        return {
            username: createUserDto.userName,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            password: createUserDto.password,
            roleName: createUserDto.role,
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
