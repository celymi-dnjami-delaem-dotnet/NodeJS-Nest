import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
    @ApiProperty({ description: 'User ID', required: true })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'User firstname', example: 'Igor', required: true })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ description: 'User lastname', example: 'Zolotnik', required: true })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has user been deleted', example: false })
    isDeleted: boolean;
}
