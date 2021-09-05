import { DbModule } from '../db/db.module';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SettingsModule } from '../settings/settings.module';

@Module({ imports: [DbModule.forRoot(), SettingsModule], providers: [SeedService], exports: [SeedService] })
export class SeedModule {}
