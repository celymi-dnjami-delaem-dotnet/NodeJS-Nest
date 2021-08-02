import registerFilters from './configuration/filters.configuration';
import registerPipes from './configuration/pipes.configuration';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SettingsService } from './settings.service';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    const settingsService = app.get(SettingsService);
    const startPort: number = settingsService.getAppPort();

    registerPipes(app);
    registerFilters(app);

    await app.listen(startPort);
}

bootstrap();
