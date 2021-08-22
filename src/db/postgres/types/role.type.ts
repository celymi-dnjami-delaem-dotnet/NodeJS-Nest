import { IBaseRole } from '../../base-types/base-role.type';
import { IUser } from './user.type';

export interface IRole extends IBaseRole {
    id: string;
    users?: IUser[];
}
