import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`],
        }),
    ],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
