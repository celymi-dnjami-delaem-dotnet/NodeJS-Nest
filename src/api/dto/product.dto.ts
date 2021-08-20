import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';

export class ProductDto extends CreateProductDto {
    @ApiProperty({ description: 'Product ID', required: true })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'General user rating for product', example: 10 })
    totalRating: number;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has product been deleted', example: false })
    isDeleted: boolean;
}
