import { Injectable } from '@nestjs/common';

@Injectable()
export default class SettingsService {
    private readonly appPort: number;

    constructor() {
        this.appPort = process.env.APPLICATION_PORT ? Number(process.env.APPLICATION_PORT) : 3000;
    }

    getAppPort(): number {
        return this.appPort;
    }
}
