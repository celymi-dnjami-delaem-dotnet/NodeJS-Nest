export interface IUserTokenCommand {
    id?: string;
    userId?: string;
    accessToken: string;
    refreshToken: string;
    updatedAt?: Date;
    createdAt?: Date;
    isDeleted?: boolean;
}
