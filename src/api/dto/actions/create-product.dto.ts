import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    displayName: string;

    @IsNumber()
    @Min(1)
    price: number;

    @IsNotEmpty()
    categoryId: string;
}
