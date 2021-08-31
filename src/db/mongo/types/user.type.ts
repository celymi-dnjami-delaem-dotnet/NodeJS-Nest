import { IBaseUser } from '../../base-types/base-user.type';
import { IRole } from './role.type';

export interface IUser extends IBaseUser {
    _id: string;
    roles?: IRole[];
}
