import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ description: 'Role name', example: 'Buyer', required: true })
    @IsNotEmpty()
    displayName: string;
}
