import { CreateUserDto } from '../../api/dto/create-user.dto';
import { ICreateUserCommand } from '../commands/create-user.command';
import { IUserCommand } from '../commands/user.command';
import { UserDto } from '../../api/dto/user.dto';

export class UserMapper {
    static mapCreateToCommandFromDto(createUserDto: CreateUserDto): ICreateUserCommand {
        return {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            password: createUserDto.password,
        };
    }

    static mapToCommandFromDto(userDto: UserDto): IUserCommand {
        return {
            id: userDto.id,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            createdAt: userDto.createdAt,
            isDeleted: userDto.isDeleted,
        };
    }

    static mapToDtoFromCommand(userCommand: IUserCommand): UserDto {
        return {
            id: userCommand.id,
            firstName: userCommand.firstName,
            lastName: userCommand.lastName,
            createdAt: userCommand.createdAt,
            isDeleted: userCommand.isDeleted,
        };
    }
}
