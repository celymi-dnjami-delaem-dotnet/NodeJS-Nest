import { AuthModule } from '../auth/auth.module';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { RatingGateway } from '../api/gateways/rating.gateway';
import { RatingService } from './services/rating.service';
import { RoleService } from './services/role.service';
import { SettingsModule } from '../settings/settings.module';
import { UserService } from './services/user.service';

@Module({})
export class BlModule {
    static forRoot(): DynamicModule {
        const moduleProviders: Provider[] = [
            AuthService,
            CategoryService,
            ProductService,
            UserService,
            RoleService,
            RatingService,
            RatingGateway,
        ];

        return {
            module: BlModule,
            imports: [SettingsModule, AuthModule.forRoot(), DbModule.forRoot()],
            providers: moduleProviders,
            exports: moduleProviders,
        };
    }
}
