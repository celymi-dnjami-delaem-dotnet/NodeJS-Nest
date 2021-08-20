export interface IUserCommand {
    id?: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    isDeleted: boolean;
}
