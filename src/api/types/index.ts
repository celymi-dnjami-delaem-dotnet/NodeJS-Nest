import { IRequestUser } from '../../auth/types';
import { Request } from 'express';

export interface ApiRequest extends Request {
    user: IRequestUser;
}
