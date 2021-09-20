import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRatingDto {
    @ApiProperty({ description: 'User ID', required: true })
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: 'Product ID', required: true })
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Rating number', example: 10, required: true })
    @IsNotEmpty()
    rating: number;
}
