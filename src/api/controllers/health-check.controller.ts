import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@ApiTags(ControllerTags.HealthCheck)
@Controller('api/health-check')
export class HealthCheckController {
    constructor(
        private readonly _mongoHealthIndicator: MongooseHealthIndicator,
        private readonly _healthCheckService: HealthCheckService,
    ) {}

    @Get()
    @HealthCheck()
    async getHealthCheckServiceIndicator(): Promise<string> {
        const { status } = await this._healthCheckService.check([
            () => this._mongoHealthIndicator.pingCheck('mongoose-check'),
        ]);

        return status === 'ok' ? 'Healthy' : 'Unhealthy';
    }
}
