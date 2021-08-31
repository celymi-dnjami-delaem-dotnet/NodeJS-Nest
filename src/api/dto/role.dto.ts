import { ApiProperty } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty } from 'class-validator';

export class RoleDto extends CreateRoleDto {
    @ApiProperty({ description: 'Role ID', required: true })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has product been deleted', example: false })
    isDeleted: boolean;
}
