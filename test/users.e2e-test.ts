import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ICreateRoleCommand } from '../src/bl/commands/create-role.command';
import { ICreateUserCommand } from '../src/bl/commands/create-user.command';
import { IRoleServiceAdapter, RoleServiceAdapterName } from '../src/db/adapter/role-service.adapter';
import { IUserCommand } from '../src/bl/commands/user.command';
import { IUserServiceAdapter, UserServiceAdapterName } from '../src/db/adapter/user-service.adapter';
import { Response } from 'supertest';
import { ServiceResultType } from '../src/bl/result-wrappers/service-result-type';
import { Test, TestingModule } from '@nestjs/testing';
import { TestUtils } from './utils';
import { UserDto } from '../src/api/dto/user.dto';

describe('UserController (e2e)', () => {
    const baseUserUrl = '/api/users';

    let userServiceAdapter: IUserServiceAdapter;
    let roleServiceAdapter: IRoleServiceAdapter;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new CustomExceptionFilter());

        roleServiceAdapter = moduleFixture.get(RoleServiceAdapterName);
        userServiceAdapter = moduleFixture.get(UserServiceAdapterName);

        await app.init();
    });

    afterEach(async () => {
        await userServiceAdapter.removeAllUsers();
        await roleServiceAdapter.removeAllRoles();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`Should return ${HttpStatus.OK} and collection of items on ${baseUserUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseUserUrl, true);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body).toBeInstanceOf(Array);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseUserUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseUserUrl);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.OK} and found item on ${TestUtils.getUrlWithId(
        baseUserUrl,
        ':id',
    )} (GET)`, async () => {
        const createdRoleId = await createRole();
        const createdUser = await createUser(createdRoleId);

        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseUserUrl, createdUser.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.id).toEqual(createdUser.id);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${TestUtils.getUrlWithId(
        baseUserUrl,
        ':id',
    )} (GET)`, async () => {
        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseUserUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} on missing item on ${TestUtils.getUrlWithId(
        baseUserUrl,
        ':id',
    )} (GET)`, async () => {
        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseUserUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.OK} and updated item on ${baseUserUrl} (PUT)`, async () => {
        const createdRoleId = await createRole();
        const createdUser = await createUser(createdRoleId);

        const data: UserDto = {
            id: createdUser.id,
            createdAt: createdUser.createdAt,
            firstName: 'TestFirstName',
            isDeleted: createdUser.isDeleted,
            lastName: 'TestLastName',
            roles: [],
            userName: createdUser.userName,
        };
        const response: Response = await ApiRequest.put(
            app.getHttpServer(),
            baseUserUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.firstName).toEqual(data.firstName);
        expect(response.body.lastName).toEqual(data.lastName);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseUserUrl} (PUT)`, async () => {
        const data: UserDto = {
            id: 'test_id',
            createdAt: new Date(),
            firstName: 'TestFirstName',
            isDeleted: false,
            lastName: 'TestLastName',
            roles: [],
            userName: 'test',
        };
        const response: Response = await ApiRequest.put(app.getHttpServer(), baseUserUrl, data as Record<string, any>);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on ${TestUtils.getSoftRemoveUrlWithId(
        baseUserUrl,
        ':id',
    )} (DELETE)`, async () => {
        const createdRoleId = await createRole();
        const createdUser = await createUser(createdRoleId);

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseUserUrl, createdUser.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);

        const updatedUser = await userServiceAdapter.getUserById(createdUser.id);
        expect(updatedUser.data.isDeleted).toBeTruthy();
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${TestUtils.getSoftRemoveUrlWithId(
        baseUserUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseUserUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on ${TestUtils.getSoftRemoveUrlWithId(
        baseUserUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseUserUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on ${baseUserUrl} (DELETE)`, async () => {
        const createdRoleId = await createRole();
        const createdUser = await createUser(createdRoleId);

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseUserUrl, createdUser.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseUserUrl} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseUserUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on ${baseUserUrl} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseUserUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
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
            firstName: 'test',
            lastName: 'test',
            password: 'test',
            roleId,
        };
        const createdEntity = await userServiceAdapter.createUser(creationData);

        expect(createdEntity.serviceResultType).toEqual(ServiceResultType.Success);
        expect(createdEntity.data).toBeTruthy();

        return createdEntity.data;
    };
});
