import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
    @ApiProperty({ description: 'User ID', required: true })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'User roles' })
    roles: UserRoleDto[];

    @ApiProperty({ description: 'User name', example: 'TestUser', required: true })
    @IsNotEmpty()
    userName: string;

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

export class UserRoleDto {
    @ApiProperty({ description: 'Role ID' })
    id: string;

    @ApiProperty({ description: 'Role name', example: 'Buyer' })
    displayName: string;
}
