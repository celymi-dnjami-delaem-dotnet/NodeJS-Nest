import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductService } from './services/product.service';
import { RoleService } from './services/role.service';
import { SettingsModule } from '../settings/settings.module';
import { SettingsService } from '../settings/settings.service';
import { UserService } from './services/user.service';

@Module({})
export class BlModule {
    static forRoot(): DynamicModule {
        const moduleProviders: Provider[] = [AuthService, CategoryService, ProductService, UserService, RoleService];

        return {
            module: BlModule,
            imports: [
                SettingsModule,
                JwtModule.registerAsync({
                    imports: [SettingsModule],
                    useFactory: async (settings: SettingsService) => ({
                        secret: settings.jwtSecret,
                        signOptions: {
                            expiresIn: '3600s',
                        },
                    }),
                    inject: [SettingsService],
                }),
                DbModule.forRoot(),
            ],
            providers: moduleProviders,
            exports: moduleProviders,
        };
    }
}
