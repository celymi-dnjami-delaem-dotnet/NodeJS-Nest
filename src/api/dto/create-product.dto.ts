import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ description: 'Product name', example: 'Call of Duty', required: true })
    @IsNotEmpty()
    displayName: string;

    @ApiProperty({ description: 'Product price', example: 60, minimum: 1, default: 1, required: true })
    @IsNumber()
    @Min(1)
    price: number;

    @ApiProperty({ description: 'Product category ID. If it is missing - no category will be attached' })
    categoryId: string;
}
