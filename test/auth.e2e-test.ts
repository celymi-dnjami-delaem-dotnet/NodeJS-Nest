import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { DefaultRoles } from '../src/bl/constants';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ICreateRoleCommand } from '../src/bl/commands/create-role.command';
import { ICreateUserCommand } from '../src/bl/commands/create-user.command';
import { IRoleServiceAdapter, RoleServiceAdapterName } from '../src/db/adapter/role-service.adapter';
import { IUserCommand } from '../src/bl/commands/user.command';
import { IUserServiceAdapter, UserServiceAdapterName } from '../src/db/adapter/user-service.adapter';
import { IUserTokenServiceAdapter, UserTokenServiceAdapterName } from '../src/db/adapter/user-token-service.adapter';
import { Response } from 'supertest';
import { ServiceResultType } from '../src/bl/result-wrappers/service-result-type';
import { SignInUserDto } from '../src/api/dto/sign-in-user.dto';
import { SignUpUserDto } from '../src/api/dto/sign-up-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserUtils } from '../src/bl/utils/user.utils';
import { testFirstName, testLastName, testName, testPassword } from './constants';

describe('AuthController (e2e)', () => {
    const baseAuthUrl = '/api/auth';

    let userTokenServiceAdapter: IUserTokenServiceAdapter;
    let roleServiceAdapter: IRoleServiceAdapter;
    let userServiceAdapter: IUserServiceAdapter;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new CustomExceptionFilter());

        roleServiceAdapter = moduleFixture.get(RoleServiceAdapterName);
        userServiceAdapter = moduleFixture.get(UserServiceAdapterName);
        userTokenServiceAdapter = moduleFixture.get(UserTokenServiceAdapterName);

        await app.init();
    });

    afterEach(async () => {
        await userTokenServiceAdapter.removeAllUserTokens();
        await userServiceAdapter.removeAllUsers();
        await roleServiceAdapter.removeAllRoles();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`Should return ${HttpStatus.CREATED} on ${baseAuthUrl}/sign-up (POST)`, async () => {
        await createRole(DefaultRoles.Buyer);

        const data: SignUpUserDto = {
            firstName: testFirstName,
            lastName: testLastName,
            password: testPassword,
            userName: testName,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            `${baseAuthUrl}/sign-up`,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.CREATED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing role on ${baseAuthUrl}/sign-up (POST)`, async () => {
        const data: SignUpUserDto = {
            firstName: testFirstName,
            lastName: testLastName,
            password: testPassword,
            userName: testName,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            `${baseAuthUrl}/sign-up`,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.OK} for valid auth data on ${baseAuthUrl}/sign-in (POST)`, async () => {
        const createdRole = await createRole(DefaultRoles.Buyer);
        await createUser(createdRole, testName);

        const data: SignInUserDto = {
            password: testPassword,
            userName: testName,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            `${baseAuthUrl}/sign-in`,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.accessToken).toBeTruthy();
        expect(response.body.refreshToken).toBeTruthy();
    });

    it(`Should return ${HttpStatus.BAD_REQUEST} for invalid auth data on ${baseAuthUrl}/sign-in (POST)`, async () => {
        const data: SignInUserDto = {
            password: testPassword,
            userName: testName,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            `${baseAuthUrl}/sign-in`,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it(`Should return ${HttpStatus.BAD_REQUEST} for invalid auth data on ${baseAuthUrl}/sign-in (POST)`, async () => {
        const data: SignInUserDto = {
            password: testPassword,
            userName: testName,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            `${baseAuthUrl}/sign-in`,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it(`Should return ${HttpStatus.BAD_REQUEST} on missing refresh token header on ${baseAuthUrl}/renew-token (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), `${baseAuthUrl}/renew-token`, true);

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} on missing refresh token header on ${baseAuthUrl}/renew-token (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), `${baseAuthUrl}/renew-token`);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    const createRole = async (displayName = 'TestRole'): Promise<string> => {
        const creationData: ICreateRoleCommand = { displayName };
        const createdEntity = await roleServiceAdapter.createRole(creationData);

        expect(createdEntity).toBeTruthy();
        expect(createdEntity.id).toBeTruthy();

        return createdEntity.id;
    };

    const createUser = async (roleId: string, displayName = 'TestRole'): Promise<IUserCommand> => {
        const creationData: ICreateUserCommand = {
            username: displayName,
            firstName: testFirstName,
            lastName: testLastName,
            password: UserUtils.hashPassword(testPassword),
            roleId,
        };
        const createdEntity = await userServiceAdapter.createUser(creationData);

        expect(createdEntity.serviceResultType).toEqual(ServiceResultType.Success);
        expect(createdEntity.data).toBeTruthy();

        return createdEntity.data;
    };
});
