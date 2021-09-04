import { IBaseUser } from '../../base-types/base-user.type';
import { IRating } from './rating.type';
import { IRole } from './role.type';

export interface IUser extends IBaseUser {
    _id: string;
    roles?: IRole[];
    ratings?: IRating[];
}
