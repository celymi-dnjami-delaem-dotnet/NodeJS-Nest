import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingsService {
    private readonly appPort: number;

    constructor(private conf: ConfigService) {
        this.appPort = conf.get<number>('APPLICATION_PORT', 3000);
    }

    getAppPort(): number {
        return Number(this.appPort);
    }
}
