import { BlModule } from '../bl/bl.module';
import { CategoryController } from './controllers/category.controller';
import { HealthCheckController } from './controllers/health-check.controller';
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [BlModule, TerminusModule],
    controllers: [ProductController, CategoryController, HealthCheckController],
})
export class ApiModule {}
