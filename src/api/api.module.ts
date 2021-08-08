import { APP_INTERCEPTOR } from '@nestjs/core';
import { BlModule } from '../bl/bl.module';
import { CategoryController } from './controllers/category.controller';
import { ConsoleLogger, Module } from '@nestjs/common';
import { HealthCheckController } from './controllers/health-check.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ProductController } from './controllers/product.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [BlModule, TerminusModule],
    controllers: [ProductController, CategoryController, HealthCheckController],
    providers: [
        ConsoleLogger,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class ApiModule {}
