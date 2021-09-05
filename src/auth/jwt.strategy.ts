import { ExtractJwt, Strategy } from 'passport-jwt';
import { IRequestUser } from './types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly _settingsService: SettingsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: !_settingsService.jwtUseExpiresIn,
            secretOrKey: _settingsService.jwtSecret,
            audience: _settingsService.jwtAudience,
            issuer: _settingsService.jwtIssuer,
        });
    }

    async validate(payload): Promise<IRequestUser> {
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles.split(','),
        };
    }
}
