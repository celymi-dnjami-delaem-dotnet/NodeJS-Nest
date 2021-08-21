export interface IUserCommand {
    id?: string;
    userName: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    isDeleted: boolean;
}
