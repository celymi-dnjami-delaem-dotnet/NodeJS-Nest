import { IBaseDb } from './base-db.type';

export interface IBaseUserToken extends IBaseDb {
    accessToken: string;
    refreshToken: string;
    updatedAt: Date;
}
