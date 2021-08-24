import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { DbModule } from '../db/db.module';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { RoleService } from './services/role.service';
import { SettingsModule } from '../settings/settings.module';
import { UserService } from './services/user.service';

@Module({})
export class BlModule {
    static forRoot(): DynamicModule {
        const moduleProviders: Provider[] = [AuthService, CategoryService, ProductService, UserService, RoleService];

        return {
            module: BlModule,
            imports: [SettingsModule, DbModule.forRoot()],
            providers: moduleProviders,
            exports: moduleProviders,
        };
    }
}
