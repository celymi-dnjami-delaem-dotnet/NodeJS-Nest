import { IRoleCommand } from '../bl/commands/role.command';
import { IRoleServiceAdapter, RoleServiceAdapterName } from '../db/adapter/role-service.adapter';
import { IUserServiceAdapter, UserServiceAdapterName } from '../db/adapter/user-service.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceResultType } from '../bl/result-wrappers/service-result-type';
import { SettingsService } from '../settings/settings.service';
import { UserUtils } from '../bl/utils/user.utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class SeedService {
    constructor(
        @Inject(RoleServiceAdapterName) private readonly _roleServiceAdapter: IRoleServiceAdapter,
        @Inject(UserServiceAdapterName) private readonly _userServiceAdapter: IUserServiceAdapter,
        private readonly _settingsService: SettingsService,
    ) {}

    async seedData(): Promise<void> {
        if (!this._settingsService.seedInitialData) {
            return;
        }

        let data;
        try {
            data = JSON.parse(readFileSync(resolve(__dirname, `../../../seed.json`), 'utf-8'));
        } catch (error) {
            console.error(`Unable to read seed.json, error: ${error.message}`);

            return;
        }

        const seededRoles = await this.seedRoles(data.roles);
        await this.seedUsers(data.users, seededRoles);
    }

    private async seedRoles(roles): Promise<IRoleCommand[]> {
        if (!roles || !roles.length) {
            return;
        }
        const createdRoles: IRoleCommand[] = [];

        for (const role of roles) {
            const existingRole = await this._roleServiceAdapter.getRoleByName(role.displayName);
            if (existingRole.serviceResultType === ServiceResultType.Success) {
                createdRoles.push(existingRole.data);

                continue;
            }

            const createdRole = await this._roleServiceAdapter.createRole({ displayName: role.displayName });
            createdRoles.push(createdRole);
        }

        return createdRoles;
    }

    private async seedUsers(users, roles: IRoleCommand[]): Promise<void> {
        if (!users || !users.length || !roles.length) {
            return;
        }

        for (const user of users) {
            const existingSeedRole = roles.find((x) => x.displayName === user.role);
            if (!existingSeedRole) {
                continue;
            }

            const existingDbRole = await this._roleServiceAdapter.getRoleByName(existingSeedRole.displayName);
            if (existingDbRole.serviceResultType !== ServiceResultType.Success) {
                continue;
            }

            await this._userServiceAdapter.createUser({
                username: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                password: UserUtils.hashPassword(user.password),
                roleId: existingSeedRole.id,
            });
        }
    }
}
