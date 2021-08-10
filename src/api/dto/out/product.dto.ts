import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from '../in/create-product.dto';

export class ProductDto extends CreateProductDto {
    @ApiProperty({ description: 'Product ID' })
    id: string;

    @ApiProperty({ description: 'General user rating for product', example: 10 })
    totalRating: number;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has product been deleted', example: false })
    isDeleted: boolean;
}
