import { IBaseUserToken } from '../../base-types/base-user-token.type';
import { IUser } from './user.type';

export interface IUserToken extends IBaseUserToken {
    _id: string;
    user: IUser;
}
