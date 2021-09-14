import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { BlModule } from '../bl/bl.module';
import { CategoryController } from './controllers/category.controller';
import { HealthCheckController } from './controllers/health-check.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggingModule } from '../logging/logging.module';
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { RatingController } from './controllers/rating.controller';
import { RoleController } from './controllers/role.controller';
import { SettingsModule } from '../settings/settings.module';
import { TerminusModule } from '@nestjs/terminus';
import { UserController } from './controllers/user.controller';

@Module({
    imports: [SettingsModule, BlModule.forRoot(), AuthModule, LoggingModule, TerminusModule],
    controllers: [
        AuthController,
        ProductController,
        CategoryController,
        UserController,
        RoleController,
        RatingController,
        HealthCheckController,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class ApiModule {}
