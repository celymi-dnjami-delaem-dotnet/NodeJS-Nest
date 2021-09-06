import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('CategoryController (e2e)', () => {
    const baseCategoryUrl = '/api/categories';

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

    it(`Should return collection on ${baseCategoryUrl} (GET)`, async () => {
        const response: request.Response = await request(app.getHttpServer()).get(baseCategoryUrl);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toEqual([]);
    });
});
