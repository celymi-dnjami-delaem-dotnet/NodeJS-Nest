import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import registerFilters from './configuration/filters.configuration';
import { SettingsService } from './settings.service';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    const settingsService = app.get(SettingsService);
    const startPort: number = settingsService.getAppPort() || 3000;

    registerFilters(app);

    await app.listen(startPort);
}

bootstrap();
