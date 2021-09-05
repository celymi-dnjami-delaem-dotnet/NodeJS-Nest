import registerFilters from './configuration/filters.configuration';
import registerPipes from './configuration/pipes.configuration';
import registerSwagger from './configuration/swagger.configuration';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed/seed.service';
import { SettingsService } from './settings/settings.service';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    const settingsService = app.get(SettingsService);
    const seedService = app.get(SeedService);

    const startPort: number = settingsService.appPort;

    registerPipes(app);
    registerFilters(app);
    registerSwagger(app);
    await seedService.seedData();

    await app.listen(startPort);
}

bootstrap();
