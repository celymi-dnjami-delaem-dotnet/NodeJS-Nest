import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Category name', example: 'Shooter', required: true })
    @IsNotEmpty()
    public displayName: string;
}
