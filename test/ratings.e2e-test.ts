import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CreateRatingDto } from '../src/api/dto/create-rating.dto';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ICreateProductCommand } from '../src/bl/commands/create-product.command';
import { ICreateRatingCommand } from '../src/bl/commands/create-rating.command';
import { ICreateUserCommand } from '../src/bl/commands/create-user.command';
import { IProductCommand } from '../src/bl/commands/product.command';
import { IProductServiceAdapter, ProductServiceAdapterName } from '../src/db/adapter/product-service.adapter';
import { IRatingCommand } from '../src/bl/commands/rating.command';
import { IRatingServiceAdapter, RatingServiceAdapterName } from '../src/db/adapter/rating-service.adapter';
import { IUserCommand } from '../src/bl/commands/user.command';
import { IUserServiceAdapter, UserServiceAdapterName } from '../src/db/adapter/user-service.adapter';
import { Response } from 'supertest';
import { ServiceResultType } from '../src/bl/result-wrappers/service-result-type';
import { Test, TestingModule } from '@nestjs/testing';
import { TestUtils } from './utils';
import {
    invalidItemId,
    testProductName,
    testRoleName,
    testUserFirstName,
    testUserLastName,
    testUserPassword,
} from './constants';

describe('CategoryController (e2e)', () => {
    const baseRatingUrl = '/api/ratings';

    let productServiceAdapter: IProductServiceAdapter;
    let userServiceAdapter: IUserServiceAdapter;
    let ratingServiceAdapter: IRatingServiceAdapter;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new CustomExceptionFilter());

        productServiceAdapter = moduleFixture.get(ProductServiceAdapterName);
        userServiceAdapter = moduleFixture.get(UserServiceAdapterName);
        ratingServiceAdapter = moduleFixture.get(RatingServiceAdapterName);

        await app.init();
    });

    afterEach(async () => {
        await ratingServiceAdapter.removeAllRatings();
        await productServiceAdapter.removeAllProducts();
        await userServiceAdapter.removeAllUsers();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`Should return ${HttpStatus.OK} and collection of items on ${baseRatingUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseRatingUrl, true);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body).toBeInstanceOf(Array);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseRatingUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseRatingUrl);

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.OK} and found item on ${TestUtils.getUrlWithId(
        baseRatingUrl,
        ':id',
    )} (GET)`, async () => {
        const createdUser = await createUser();
        const createdProduct = await createProduct();
        const createdRating = await createRating(createdUser.id, createdProduct.id);

        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseRatingUrl, createdRating.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.id).toEqual(createdRating.id);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${TestUtils.getUrlWithId(
        baseRatingUrl,
        ':id',
    )} (GET)`, async () => {
        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseRatingUrl, invalidItemId),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} on missing item on ${TestUtils.getUrlWithId(
        baseRatingUrl,
        ':id',
    )} (GET)`, async () => {
        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseRatingUrl, invalidItemId),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.CREATED} for anonymous user on ${baseRatingUrl} (POST)`, async () => {
        const createdUser = await createUser();
        const createdProduct = await createProduct();

        const data: CreateRatingDto = {
            productId: createdProduct.id,
            userId: createdUser.id,
            rating: 10,
        };
        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseRatingUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(response.body).toBeTruthy();
        expect(response.body.rating).toEqual(data.rating);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseRatingUrl} (POST)`, async () => {
        const data: CreateRatingDto = { rating: 10, userId: invalidItemId, productId: invalidItemId };
        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseRatingUrl,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing user on ${baseRatingUrl} (POST)`, async () => {
        const createdUser = await createUser();

        const data: CreateRatingDto = { rating: 10, userId: createdUser.id, productId: invalidItemId };
        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseRatingUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing product on ${baseRatingUrl} (POST)`, async () => {
        const createdProduct = await createProduct();

        const data: CreateRatingDto = { rating: 10, userId: invalidItemId, productId: createdProduct.id };
        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseRatingUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on ${TestUtils.getSoftRemoveUrlWithId(
        baseRatingUrl,
        ':id',
    )} (DELETE)`, async () => {
        const user = await createUser();
        const product = await createProduct();
        const createdRating = await ratingServiceAdapter.setRating({
            rating: 10,
            userId: user.id,
            productId: product.id,
        });

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseRatingUrl, createdRating.data.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);

        const softRemovedRating = await ratingServiceAdapter.getRatingById(createdRating.data.id);

        expect(softRemovedRating.serviceResultType).toEqual(ServiceResultType.Success);
        expect(softRemovedRating.data.isDeleted).toBeTruthy();
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on remove ${TestUtils.getSoftRemoveUrlWithId(
        baseRatingUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseRatingUrl, invalidItemId),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on remove ${TestUtils.getSoftRemoveUrlWithId(
        baseRatingUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseRatingUrl, invalidItemId),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on remove ${TestUtils.getUrlWithId(
        baseRatingUrl,
        ':id',
    )} (DELETE)`, async () => {
        const user = await createUser();
        const product = await createProduct();
        const createdRating = await ratingServiceAdapter.setRating({
            rating: 10,
            userId: user.id,
            productId: product.id,
        });

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseRatingUrl, createdRating.data.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on remove ${TestUtils.getUrlWithId(
        baseRatingUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseRatingUrl, invalidItemId),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on remove ${TestUtils.getUrlWithId(
        baseRatingUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseRatingUrl, invalidItemId),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    const createUser = async (displayName = testRoleName): Promise<IUserCommand> => {
        const creationData: ICreateUserCommand = {
            username: displayName,
            firstName: testUserFirstName,
            lastName: testUserLastName,
            password: testUserPassword,
        };
        const createdEntity = await userServiceAdapter.createUser(creationData);

        expect(createdEntity.serviceResultType).toEqual(ServiceResultType.Success);
        expect(createdEntity.data).toBeTruthy();

        return createdEntity.data;
    };

    const createProduct = async (): Promise<IProductCommand> => {
        const productData: ICreateProductCommand = {
            displayName: testProductName,
            price: 100,
        };
        const createdProductEntity = await productServiceAdapter.createProduct(productData);

        expect(createdProductEntity.serviceResultType).toEqual(ServiceResultType.Success);
        expect(createdProductEntity.data).toBeTruthy();

        return createdProductEntity.data;
    };

    const createRating = async (userId: string, productId: string): Promise<IRatingCommand> => {
        const creationData: ICreateRatingCommand = {
            productId,
            rating: 10,
            userId,
        };
        const createdEntity = await ratingServiceAdapter.setRating(creationData);

        expect(createdEntity.serviceResultType).toEqual(ServiceResultType.Success);
        expect(createdEntity.data).toBeTruthy();

        return createdEntity.data;
    };
});
