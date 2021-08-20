import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../../bl/services/user.service';

@ApiTags(ControllerTags.Users)
@Controller('api/users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get()
    @ApiOkResponse({ type: [UserDto], description: 'OK' })
    async getUsers(): Promise<UserDto[]> {
        return this._userService.getUsers();
    }

    @Get('id/:id')
    @ApiOkResponse({ type: UserDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getUserById(@Query('id') id: string): Promise<UserDto> {
        return this._userService.getUserById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: CreateUserDto, description: 'Created' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async createUser(@Body() createUser: CreateUserDto): Promise<UserDto> {
        return this._userService.createUser(createUser);
    }

    @Put()
    @ApiOkResponse({ type: UserDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async updateUser(@Body() user: UserDto): Promise<UserDto> {
        return this._userService.updateUser(user);
    }

    @Delete('soft-remove/id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async softRemoveUser(@Param('id') id: string): Promise<void> {
        return this._userService.softRemoveUser(id);
    }

    @Delete('id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async removeUser(@Param('id') id: string): Promise<void> {
        return this._userService.removeUser(id);
    }
}
