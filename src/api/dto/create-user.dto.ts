import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
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
