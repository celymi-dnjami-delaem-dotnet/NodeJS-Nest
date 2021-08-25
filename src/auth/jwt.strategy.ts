import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly _settingsService: SettingsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: _settingsService.jwtSecret,
            audience: _settingsService.jwtAudience,
            issuer: _settingsService.jwtIssuer,
        });
    }

    async validate(payload) {
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles.split(','),
        };
    }
}
