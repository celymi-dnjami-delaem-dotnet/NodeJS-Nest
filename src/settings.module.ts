import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
