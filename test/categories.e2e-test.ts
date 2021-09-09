import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CategoryDto } from '../src/api/dto/category.dto';
import { CategoryServiceAdapterName, ICategoryServiceAdapter } from '../src/db/adapter/category-service.adapter';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Response } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

describe('CategoryController (e2e)', () => {
    const baseCategoryUrl = '/api/categories';

    let categoryAdapter: ICategoryServiceAdapter;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new CustomExceptionFilter());

        categoryAdapter = moduleFixture.get(CategoryServiceAdapterName);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
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

    it(`Should return ${HttpStatus.OK} and found item on ${baseCategoryUrl}/id/:id (GET)`, async () => {
        const data = { displayName: 'TestCategory' };
        const createdEntity = await categoryAdapter.createCategory(data);

        const id = createdEntity.id;
        expect(id).toBeTruthy();

        const response: Response = await ApiRequest.get(app.getHttpServer(), `${baseCategoryUrl}/id/${id}`);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.id).toBeTruthy();

        await categoryAdapter.removeCategory(id);
    });

    it(`Should return ${HttpStatus.CREATED} and created item on ${baseCategoryUrl} (POST)`, async () => {
        const data = { displayName: 'TestCategory' };

        const createdCategoryResponse: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseCategoryUrl,
            data,
            true,
        );

        expect(createdCategoryResponse.status).toEqual(HttpStatus.CREATED);
        expect(createdCategoryResponse.body).toBeTruthy();
        expect(createdCategoryResponse.body.id).toBeTruthy();

        await categoryAdapter.removeCategory(createdCategoryResponse.body.id);
    });

    it(`Should return ${HttpStatus.OK} and updated existing item on ${baseCategoryUrl} (PUT)`, async () => {
        const creationData = { displayName: 'TestCategory' };
        const createdEntity = await categoryAdapter.createCategory(creationData);

        expect(createdEntity.id).toBeTruthy();

        const newName = 'NewName';
        const data: CategoryDto = {
            displayName: newName,
            id: createdEntity.id,
            createdAt: createdEntity.createdAt,
            isDeleted: createdEntity.isDeleted,
            products: [],
        };

        const response: Response = await ApiRequest.put(
            app.getHttpServer(),
            baseCategoryUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.displayName).toEqual(newName);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for unauthorized user on remove item ${baseCategoryUrl} (PUT)`, async () => {
        const data: CategoryDto = {
            displayName: 'NewName',
            id: '613654eb07ade7fae7a566c7',
            createdAt: new Date(),
            isDeleted: false,
            products: [],
        };

        const response: Response = await ApiRequest.put(
            app.getHttpServer(),
            baseCategoryUrl,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on ${baseCategoryUrl} (PUT)`, async () => {
        const data: CategoryDto = {
            displayName: 'NewName',
            id: '613654eb07ade7fae7a566c7',
            createdAt: new Date(),
            isDeleted: false,
            products: [],
        };

        const response: Response = await ApiRequest.put(
            app.getHttpServer(),
            baseCategoryUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on soft-remove item ${baseCategoryUrl} (DELETE)`, async () => {
        const creationData = { displayName: 'TestCategory' };
        const createdEntity = await categoryAdapter.createCategory(creationData);

        expect(createdEntity.id).toBeTruthy();

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            `${baseCategoryUrl}/soft-remove/id/${createdEntity.id}`,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);

        await categoryAdapter.removeCategory(createdEntity.id);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for unauthorized user on soft-remove ${baseCategoryUrl} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            `${baseCategoryUrl}/soft-remove/id/613654eb07ade7fae7a566c7`,
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} on soft-remove for missing item ${baseCategoryUrl} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            `${baseCategoryUrl}/soft-remove/id/613654eb07ade7fae7a566c7`,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on remove ${baseCategoryUrl} (DELETE)`, async () => {
        const creationData = { displayName: 'TestCategory' };
        const createdEntity = await categoryAdapter.createCategory(creationData);

        expect(createdEntity.id).toBeTruthy();

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            `${baseCategoryUrl}/id/${createdEntity.id}`,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for unauthorized user on remove ${baseCategoryUrl} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            `${baseCategoryUrl}/id/613654eb07ade7fae7a566c7`,
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} on remove for missing item ${baseCategoryUrl} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            `${baseCategoryUrl}/id/613654eb07ade7fae7a566c7`,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });
});
