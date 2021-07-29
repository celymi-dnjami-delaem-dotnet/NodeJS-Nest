import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { CustomExceptionFilter } from './api/filters/custom-exception.filter';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    const startPort: number = Number(process.env.APPLICATION_PORT) || 3000;

    app.useGlobalFilters(new CustomExceptionFilter());

    await app.listen(startPort);
}

bootstrap();
