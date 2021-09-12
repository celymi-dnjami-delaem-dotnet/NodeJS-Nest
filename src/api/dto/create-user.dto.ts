import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'User name', example: 'TestUser', required: true })
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ description: 'User role. If it is missing - no role will be attached', example: 'Buyer' })
    roleId: string;

    @ApiProperty({ description: 'User firstname', example: 'Igor', required: true })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ description: 'User lastname', example: 'Zolotnik', required: true })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ description: 'User password', example: 'TestPassword123', required: true })
    @IsNotEmpty()
    password: string;
}
