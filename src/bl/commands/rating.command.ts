export interface IRatingCommand {
    id?: string;
    productId?: string;
    userId?: string;
    rating: number;
    createdAt: Date;
    isDeleted: boolean;
}
