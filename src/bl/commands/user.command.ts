export interface IUserCommand {
    id?: string;
    userName: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    isDeleted: boolean;
    roles?: IUserRoleCommand[];
}

export interface IUserRoleCommand {
    id: string;
    displayName: string;
}
