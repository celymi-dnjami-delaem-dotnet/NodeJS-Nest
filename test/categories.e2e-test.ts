import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CategoryDto } from '../src/api/dto/category.dto';
import { CategoryServiceAdapterName, ICategoryServiceAdapter } from '../src/db/adapter/category-service.adapter';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ICategoryCommand } from '../src/bl/commands/category.command';
import { ICreateCategoryCommand } from '../src/bl/commands/create-category.command';
import { Response } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { TestUtils } from './utils';

describe('CategoryController (e2e)', () => {
    const baseCategoryUrl = '/api/categories';

    let categoryServiceAdapter: ICategoryServiceAdapter;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new CustomExceptionFilter());

        categoryServiceAdapter = moduleFixture.get(CategoryServiceAdapterName);

        await app.init();
    });

    afterEach(async () => {
        await categoryServiceAdapter.removeAllCategories();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`Should return ${HttpStatus.OK} and collection of items on ${baseCategoryUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseCategoryUrl);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body).toBeInstanceOf(Array);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on ${baseCategoryUrl}/id/:id (GET)`, async () => {
        const testId = 'c7052035-5737-4587-8002-e43eb6598cbd';

        const response: Response = await ApiRequest.get(app.getHttpServer(), `${baseCategoryUrl}/id/${testId}`);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.OK} and found item on ${baseCategoryUrl}/id/:id (GET)`, async () => {
        const createdEntity = await createCategory();

        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseCategoryUrl, createdEntity.id),
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.id).toBeTruthy();
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
    });

    it(`Should return ${HttpStatus.OK} and updated existing item on ${baseCategoryUrl} (PUT)`, async () => {
        const createdEntity = await createCategory();

        const data: CategoryDto = {
            id: createdEntity.id,
            displayName: 'NewCategoryName',
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
        expect(response.body.displayName).toEqual(data.displayName);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for unauthorized user on remove item ${baseCategoryUrl} (PUT)`, async () => {
        const data: CategoryDto = {
            displayName: 'NewName',
            id: 'c7052035-5737-4587-8002-e43eb6598cbd',
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
            id: 'c7052035-5737-4587-8002-e43eb6598cbd',
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

    it(`Should return ${HttpStatus.NO_CONTENT} on soft-remove item ${TestUtils.getSoftRemoveUrlWithId(
        baseCategoryUrl,
        ':id',
    )} (DELETE)`, async () => {
        const createdEntity = await createCategory();

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseCategoryUrl, createdEntity.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);

        await categoryServiceAdapter.removeCategory(createdEntity.id);
    });

    it(`Should return ${
        HttpStatus.UNAUTHORIZED
    } for unauthorized user on soft-remove ${TestUtils.getSoftRemoveUrlWithId(
        baseCategoryUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseCategoryUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} on soft-remove for missing item ${TestUtils.getSoftRemoveUrlWithId(
        baseCategoryUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseCategoryUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on remove  ${TestUtils.getUrlWithId(
        baseCategoryUrl,
        ':id',
    )} (DELETE)`, async () => {
        const createdEntity = await createCategory();

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseCategoryUrl, createdEntity.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for unauthorized user on remove ${TestUtils.getUrlWithId(
        baseCategoryUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseCategoryUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} on remove for missing item ${TestUtils.getUrlWithId(
        baseCategoryUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseCategoryUrl, 'c7052035-5737-4587-8002-e43eb6598cbd'),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    const createCategory = async (): Promise<ICategoryCommand> => {
        const categoryData: ICreateCategoryCommand = { displayName: 'TestCategoryName' };
        const createdCategoryEntity = await categoryServiceAdapter.createCategory(categoryData);

        expect(createdCategoryEntity).toBeTruthy();
        expect(createdCategoryEntity.id).toBeTruthy();

        return createdCategoryEntity;
    };
});
