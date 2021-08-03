import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class CategoryDto {
    @ApiProperty({ description: 'Category ID', example: '61031510457ff504f2bdddb1' })
    id: string;

    @ApiProperty({ description: 'Category name', example: 'Shooter' })
    displayName: string;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has category been deleted', example: false })
    isDeleted: boolean;

    @ApiProperty({ description: 'Related products', type: ProductDto })
    products: ProductDto[];
}
