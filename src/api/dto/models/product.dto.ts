export class ProductDto {
    id: string;
    categoryId?: string;
    displayName: string;
    totalRating: number;
    price: number;
    createdAt: Date;
    isDeleted: boolean;
}
