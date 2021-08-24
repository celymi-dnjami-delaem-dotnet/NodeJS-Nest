import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SignInUserDto } from './sign-in-user.dto';

export class SignUpUserDto extends SignInUserDto {
    @ApiProperty({ description: 'User firstname', example: 'Igor', required: true })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ description: 'User lastname', example: 'Zolotnik', required: true })
    @IsNotEmpty()
    lastName: string;
}
