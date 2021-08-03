import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ServiceResultType } from './bl/result-wrappers/service-result-type';
import { UserFriendlyException } from './bl/exceptions/user-friendly.exception';

@Injectable()
export class SettingsService {
    private readonly appPort: number;
    private readonly mongoHost: string;
    private readonly mongoPort: number;
    private readonly mongoDb: string;
    private readonly mongoDbUser: string;
    private readonly mongoDbPassword: string;

    constructor(private conf: ConfigService) {
        this.appPort = conf.get<number>('APPLICATION_PORT', 3000);
        this.mongoHost = conf.get<string>('MONGO_DB_HOST');
        this.mongoPort = conf.get<number>('MONGO_DB_PORT');
        this.mongoDb = conf.get<string>('MONGO_DB');
        this.mongoDbUser = conf.get<string>('MONGO_DB_USER');
        this.mongoDbPassword = conf.get<string>('MONGO_DB_PASSWORD');
    }

    getAppPort(): number {
        return Number(this.appPort);
    }

    getMongooseConnectionString(): string {
        if (!this.mongoDbUser || !this.mongoDbPassword || !this.mongoHost || !this.mongoPort || !this.mongoDb) {
            throw new UserFriendlyException(ServiceResultType.InternalError, 'One on mongo-db parameters is invalid');
        }

        return `mongodb://${this.mongoDbUser}:${this.mongoDbPassword}@${this.mongoHost}:${this.mongoPort}/${this.mongoDb}?authSource=admin`;
    }
}
