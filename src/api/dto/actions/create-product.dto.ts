import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ description: 'Product name', example: 'Call of Duty', required: true })
    @IsNotEmpty()
    displayName: string;

    @ApiProperty({ description: 'Product price', example: 60, minimum: 1, default: 1, required: true })
    @IsNumber()
    @Min(1)
    price: number;

    @ApiProperty({ description: 'Product category id', example: '61031510457ff504f2bdddb1', required: true })
    @IsMongoId()
    @IsNotEmpty()
    categoryId: string;
}
