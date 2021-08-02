import registerFilters from './configuration/filters.configuration';
import registerPipes from './configuration/pipes.configuration';
import registerSwagger from './configuration/swagger.configuration';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SettingsService } from './settings/settings.service';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    const settingsService = app.get(SettingsService);
    const startPort: number = settingsService.getAppPort();

    registerPipes(app);
    registerFilters(app);
    registerSwagger(app);

    await app.listen(startPort);
}

bootstrap();
