import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@ApiTags('Health-Check')
@Controller('api/health-check')
export class HealthCheckController {
    constructor(
        private readonly mongo: MongooseHealthIndicator,
        private readonly healthCheckService: HealthCheckService,
    ) {}

    @Get()
    @HealthCheck()
    async getHealthCheckServiceIndicator(): Promise<string> {
        const { status } = await this.healthCheckService.check([() => this.mongo.pingCheck('mongoose-check')]);

        return status === 'ok' ? 'Healthy' : 'Unhealthy';
    }
}
