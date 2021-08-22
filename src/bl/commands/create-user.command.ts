export interface ICreateUserCommand {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    roleId: string;
}
