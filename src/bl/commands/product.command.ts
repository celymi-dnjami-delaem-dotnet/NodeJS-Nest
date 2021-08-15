export interface IProductCommand {
    id: string;
    price: number;
    categoryId: string;
    displayName: string;
    totalRating: number;
    createdAt: Date;
    isDeleted: boolean;
}
