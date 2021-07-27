import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { SettingsService } from './settingsService';

@Module({
    imports: [ConfigModule.forRoot(), ProductsModule],
    providers: [SettingsService],
})
export class AppModule {}
