import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty } from 'class-validator';
import { ProductDto } from './product.dto';

export class CategoryDto extends CreateCategoryDto {
    @ApiProperty({ description: 'Category ID', required: true })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has category been deleted', example: false })
    isDeleted: boolean;

    @ApiProperty({ description: 'Related products', type: ProductDto })
    products: ProductDto[];
}
