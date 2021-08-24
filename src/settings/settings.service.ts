import { ConfigService } from '@nestjs/config';
import { DbOptions } from './settings.constants';
import { Injectable } from '@nestjs/common';
import { ServiceResultType } from '../bl/result-wrappers/service-result-type';
import { UserFriendlyException } from '../bl/exceptions/user-friendly.exception';

@Injectable()
export class SettingsService {
    private readonly _appPort: number;
    private readonly _dbHost: string;
    private readonly _dbPort: number;
    private readonly _dbName: string;
    private readonly _dbUser: string;
    private readonly _dbPassword: string;
    private readonly _dbType: string;
    private readonly _jwtKey: string;

    constructor(private conf: ConfigService) {
        this._appPort = conf.get<number>('APPLICATION_PORT', 3000);
        this._dbHost = conf.get<string>('DB_HOST');
        this._dbPort = conf.get<number>('DB_PORT');
        this._dbName = conf.get<string>('DB_NAME');
        this._dbUser = conf.get<string>('DB_USER');
        this._dbPassword = conf.get<string>('DB_PASSWORD');
        this._dbType = conf.get<string>('DB_TYPE');
        this._jwtKey = conf.get<string>('JWT_KEY');
    }

    get appPort(): number {
        return Number(this._appPort);
    }

    get dbHost(): string {
        return this._dbHost;
    }

    get dbPort(): number {
        return Number(this._dbPort);
    }

    get dbName(): string {
        return this._dbName;
    }

    get dbUser(): string {
        return this._dbUser;
    }

    get dbPassword(): string {
        return this._dbPassword;
    }

    get dbType(): DbOptions {
        return this._dbType as DbOptions;
    }

    get jwtSecret(): string {
        return this._jwtKey;
    }

    getMongooseConnectionString(): string {
        if (!this._dbUser || !this._dbPassword || !this._dbHost || !this._dbPort || !this._dbName) {
            throw new UserFriendlyException(ServiceResultType.InternalError, 'One of mongo-db parameters is invalid');
        }

        return `mongodb://${this._dbUser}:${this._dbPassword}@${this._dbHost}:${this._dbPort}/${this._dbName}?authSource=admin`;
    }
}
