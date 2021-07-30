import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    displayName: string;
}
