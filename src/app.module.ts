import { ApiModule } from './api/api.module';
import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';

@Module({
    imports: [ApiModule, SeedModule],
})
export class AppModule {}
