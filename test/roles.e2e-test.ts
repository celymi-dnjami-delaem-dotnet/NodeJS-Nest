import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Response } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

describe('RolesController (e2e)', () => {
    const baseRoleUrl = '/api/roles';

    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new CustomExceptionFilter());

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseRoleUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseRoleUrl);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
