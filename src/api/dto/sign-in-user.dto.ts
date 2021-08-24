import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInUserDto {
    @ApiProperty({ description: 'User ID', example: 'test_login', required: true })
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ description: 'Password', example: 'Password123', required: true })
    @IsNotEmpty()
    password: string;
}
