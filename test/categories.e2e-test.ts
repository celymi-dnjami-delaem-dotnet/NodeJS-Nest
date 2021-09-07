import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('CategoryController (e2e)', () => {
    const baseCategoryUrl = '/api/categories';

    let jwtToken: string;
    let app: INestApplication;

    beforeAll(() => {
        jwtToken = readFileSync(resolve(__dirname, '../', 'dummytoken.txt'), 'utf-8').replace('\n', '');
        jwtToken = `Bearer ${jwtToken}`;
    });

    beforeEach(async () => {
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

    it(`Should return ${HttpStatus.CREATED} and created item on ${baseCategoryUrl} (POST)`, async () => {
        let id: string;

        try {
            const createdCategoryResponse: request.Response = await request(app.getHttpServer())
                .post(baseCategoryUrl)
                .set('Authorization', jwtToken)
                .send({ displayName: 'TestCategory' });

            expect(createdCategoryResponse.status).toEqual(HttpStatus.CREATED);

            id = createdCategoryResponse.body.id;
        } catch (e) {
            const removeResult = await request(app.getHttpServer())
                .delete(`${baseCategoryUrl}/id/${id}`)
                .set('Authorization', jwtToken);
            expect(removeResult.status).toEqual(HttpStatus.NO_CONTENT);
        }
    });

    it(`Should return collection on ${baseCategoryUrl} (GET)`, async () => {
        const response: request.Response = await request(app.getHttpServer()).get(baseCategoryUrl);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body).toBeInstanceOf(Array);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on ${baseCategoryUrl}/id/:id (GET)`, async () => {
        const testId = '613654eb07ade7fae7a566c7';

        const response: request.Response = await request(app.getHttpServer()).get(`${baseCategoryUrl}/id/${testId}`);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return found item on ${baseCategoryUrl}/id/:id (GET)`, async () => {
        let id: string;

        try {
            const createdCategoryResponse: request.Response = await request(app.getHttpServer())
                .post(baseCategoryUrl)
                .set('Authorization', jwtToken)
                .send({ displayName: 'TestCategory' });

            expect(createdCategoryResponse.status).toEqual(HttpStatus.CREATED);

            id = createdCategoryResponse.body.id;
            expect(id).toBeTruthy();

            const response: request.Response = await request(app.getHttpServer()).get(`${baseCategoryUrl}/id/${id}`);

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.body).toBeTruthy();
            expect(response.body.id).toBeTruthy();
        } finally {
            const removeResult = await request(app.getHttpServer())
                .delete(`${baseCategoryUrl}/id/${id}`)
                .set('Authorization', jwtToken);
            expect(removeResult.status).toEqual(HttpStatus.NO_CONTENT);
        }
    });
});
