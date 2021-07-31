import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
    @ApiProperty({ description: 'Product ID', example: '61031510457ff504f2bdddb1' })
    id: string;

    @ApiProperty({ description: 'Category ID product relates to', example: '61031510457ff504f2bdddb1' })
    categoryId: string;

    @ApiProperty({ description: 'Product name', example: 'Call of Duty' })
    displayName: string;

    @ApiProperty({ description: 'General user rating for product', example: 10 })
    totalRating: number;

    @ApiProperty({ description: 'Acceptable price', example: 60 })
    price: number;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has product been deleted', example: false })
    isDeleted: boolean;
}
