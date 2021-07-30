import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import registerFilters from './configuration/filters.configuration';
import { SettingsService } from './settings.service';
import registerPipes from './configuration/pipes.configuration';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    const settingsService = app.get(SettingsService);
    const startPort: number = settingsService.getAppPort();

    registerPipes(app);
    registerFilters(app);

    await app.listen(startPort);
}

bootstrap();
