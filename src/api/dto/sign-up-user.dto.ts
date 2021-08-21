import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignUpUserDto {
    @ApiProperty({ description: 'User name', example: 'TestUser', required: true })
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ description: 'User firstname', example: 'Igor', required: true })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ description: 'User lastname', example: 'Zolotnik', required: true })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ description: 'Password', example: 'Password123', required: true })
    @IsNotEmpty()
    password: string;
}
