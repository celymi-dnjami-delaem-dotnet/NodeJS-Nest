import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);
    const startPort: number = Number(process.env.APPLICATION_PORT) || 3000;

    await app.listen(startPort);
}

bootstrap();
