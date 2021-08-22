import { IBaseUser } from '../../base-types/base-user.type';
import { IRole } from './role.type';

export interface IUser extends IBaseUser {
    id: string;
    roles?: IRole[];
}
