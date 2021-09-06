import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('RolesController (e2e)', () => {
    const baseRoleUrl = '/api/roles';

    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseRoleUrl} (GET)`, async () => {
        const response: request.Response = await request(app.getHttpServer()).get(baseRoleUrl);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
});
