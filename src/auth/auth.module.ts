import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';

@Module({})
export class AuthModule {
    static forRoot(): DynamicModule {
        const jwtModule = JwtModule.registerAsync({
            imports: [SettingsModule],
            useFactory: async (settings: SettingsService) => ({
                secret: settings.jwtSecret,
                signOptions: {
                    expiresIn: settings.jwtUseExpiresIn ? settings.jwtExpirationTime : 0,
                    audience: settings.jwtAudience,
                    issuer: settings.jwtIssuer,
                },
            }),
            inject: [SettingsService],
        });

        return {
            module: AuthModule,
            imports: [SettingsModule, jwtModule],
            providers: [JwtStrategy],
            exports: [jwtModule],
        };
    }
}
