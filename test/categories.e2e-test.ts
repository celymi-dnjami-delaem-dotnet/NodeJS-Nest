import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Response } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

describe('CategoryController (e2e)', () => {
    const baseCategoryUrl = '/api/categories';

    let app: INestApplication;

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
            const data = { displayName: 'TestCategory' };

            const createdCategoryResponse: Response = await ApiRequest.post(
                app.getHttpServer(),
                baseCategoryUrl,
                data,
                true,
            );

            expect(createdCategoryResponse.status).toEqual(HttpStatus.CREATED);

            id = createdCategoryResponse.body.id;
        } catch (e) {
            const removeResult = await ApiRequest.delete(app.getHttpServer(), `${baseCategoryUrl}/id/${id}`);

            expect(removeResult.status).toEqual(HttpStatus.NO_CONTENT);
        }
    });

    it(`Should return collection on ${baseCategoryUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseCategoryUrl);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body).toBeInstanceOf(Array);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on ${baseCategoryUrl}/id/:id (GET)`, async () => {
        const testId = '613654eb07ade7fae7a566c7';

        const response: Response = await ApiRequest.get(app.getHttpServer(), `${baseCategoryUrl}/id/${testId}`);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return found item on ${baseCategoryUrl}/id/:id (GET)`, async () => {
        let id: string;

        try {
            const data = { displayName: 'TestCategory' };

            const createdCategoryResponse: Response = await ApiRequest.post(
                app.getHttpServer(),
                baseCategoryUrl,
                data,
                true,
            );

            expect(createdCategoryResponse.status).toEqual(HttpStatus.CREATED);

            id = createdCategoryResponse.body.id;
            expect(id).toBeTruthy();

            const response: Response = await ApiRequest.get(app.getHttpServer(), `${baseCategoryUrl}/id/${id}`);

            expect(response.status).toEqual(HttpStatus.OK);
            expect(response.body).toBeTruthy();
            expect(response.body.id).toBeTruthy();
        } finally {
            const removeResult = await ApiRequest.delete(app.getHttpServer(), `${baseCategoryUrl}/id/${id}`);

            expect(removeResult.status).toEqual(HttpStatus.NO_CONTENT);
        }
    });
});
