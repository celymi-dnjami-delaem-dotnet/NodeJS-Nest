import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoleManageDto {
    @ApiProperty({ description: 'User ID', required: true })
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: 'Role ID', required: true })
    @IsNotEmpty()
    roleId: string;
}
