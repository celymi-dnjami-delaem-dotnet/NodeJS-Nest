import { ApiRequest } from './api-request';
import { AppModule } from '../src/app.module';
import { CategoryServiceAdapterName, ICategoryServiceAdapter } from '../src/db/adapter/category-service.adapter';
import { CreateProductDto } from '../src/api/dto/create-product.dto';
import { CustomExceptionFilter } from '../src/api/filters/custom-exception.filter';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ICreateCategoryCommand } from '../src/bl/commands/create-category.command';
import { ICreateProductCommand } from '../src/bl/commands/create-product.command';
import { IProductCommand } from '../src/bl/commands/product.command';
import { IProductServiceAdapter, ProductServiceAdapterName } from '../src/db/adapter/product-service.adapter';
import { ProductDto } from '../src/api/dto/product.dto';
import { Response } from 'supertest';
import { ServiceResultType } from '../src/bl/result-wrappers/service-result-type';
import { Test, TestingModule } from '@nestjs/testing';
import { TestUtils } from './utils';
import { invalidItemId, testProductName } from './constants';

describe('ProductController (e2e)', () => {
    const baseProductUrl = '/api/products';

    let productServiceAdapter: IProductServiceAdapter;
    let categoryServiceAdapter: ICategoryServiceAdapter;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new CustomExceptionFilter());

        categoryServiceAdapter = moduleFixture.get(CategoryServiceAdapterName);
        productServiceAdapter = moduleFixture.get(ProductServiceAdapterName);

        await app.init();
    });

    afterEach(async () => {
        await productServiceAdapter.removeAllProducts();
        await categoryServiceAdapter.removeAllCategories();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`Should return ${HttpStatus.OK} and collection of items on ${baseProductUrl} (GET)`, async () => {
        const response: Response = await ApiRequest.get(app.getHttpServer(), baseProductUrl);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body).toBeInstanceOf(Array);
    });

    it(`Should return ${HttpStatus.OK} and found item on ${TestUtils.getUrlWithId(
        baseProductUrl,
        ':id',
    )} (GET)`, async () => {
        const categoryId = await createCategory();
        const product = await createProduct(categoryId);

        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseProductUrl, product.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.displayName).toEqual(product.displayName);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} on missing item on ${TestUtils.getUrlWithId(
        baseProductUrl,
        ':id',
    )} (GET)`, async () => {
        const response: Response = await ApiRequest.get(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseProductUrl, invalidItemId),
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.CREATED} on ${baseProductUrl} (POST)`, async () => {
        const categoryId = await createCategory();
        const data: CreateProductDto = {
            categoryId,
            displayName: testProductName,
            price: 100,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseProductUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(response.body).toBeTruthy();
        expect(response.body.displayName).toEqual(data.displayName);
    });

    it(`Should return ${HttpStatus.BAD_REQUEST} for missing category on ${baseProductUrl} (POST)`, async () => {
        const data: CreateProductDto = {
            categoryId: invalidItemId,
            displayName: testProductName,
            price: 100,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseProductUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseProductUrl} (POST)`, async () => {
        const data: CreateProductDto = {
            categoryId: invalidItemId,
            displayName: testProductName,
            price: 100,
        };

        const response: Response = await ApiRequest.post(
            app.getHttpServer(),
            baseProductUrl,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.OK} for missing item on ${baseProductUrl} (PUT)`, async () => {
        const categoryId = await createCategory();
        const product = await createProduct(categoryId);

        const data: ProductDto = {
            id: product.id,
            isDeleted: product.isDeleted,
            totalRating: product.totalRating,
            categoryId: product.categoryId,
            displayName: 'NewTestProduct',
            price: product.price,
            createdAt: product.createdAt,
        };

        const response: Response = await ApiRequest.put(
            app.getHttpServer(),
            baseProductUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeTruthy();
        expect(response.body.displayName).toEqual(data.displayName);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on ${baseProductUrl} (PUT)`, async () => {
        const data: ProductDto = {
            id: invalidItemId,
            isDeleted: false,
            totalRating: 0,
            categoryId: invalidItemId,
            displayName: testProductName,
            price: 100,
            createdAt: new Date(),
        };

        const response: Response = await ApiRequest.put(
            app.getHttpServer(),
            baseProductUrl,
            data as Record<string, any>,
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on ${baseProductUrl} (PUT)`, async () => {
        const data: ProductDto = {
            id: invalidItemId,
            isDeleted: false,
            totalRating: 0,
            categoryId: invalidItemId,
            displayName: testProductName,
            price: 100,
            createdAt: new Date(),
        };

        const response: Response = await ApiRequest.put(
            app.getHttpServer(),
            baseProductUrl,
            data as Record<string, any>,
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on soft-remove ${TestUtils.getSoftRemoveUrlWithId(
        baseProductUrl,
        ':id',
    )} (DELETE)`, async () => {
        const categoryId = await createCategory();
        const product = await createProduct(categoryId);

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseProductUrl, product.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);

        const softRemoveProduct = await productServiceAdapter.getProductById(product.id);
        expect(softRemoveProduct.data.isDeleted).toBeTruthy();
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on soft-remove ${TestUtils.getSoftRemoveUrlWithId(
        baseProductUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseProductUrl, invalidItemId),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on soft-remove ${TestUtils.getSoftRemoveUrlWithId(
        baseProductUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getSoftRemoveUrlWithId(baseProductUrl, invalidItemId),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it(`Should return ${HttpStatus.NO_CONTENT} on remove ${TestUtils.getUrlWithId(
        baseProductUrl,
        ':id',
    )} (DELETE)`, async () => {
        const categoryId = await createCategory();
        const product = await createProduct(categoryId);

        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseProductUrl, product.id),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
    });

    it(`Should return ${HttpStatus.UNAUTHORIZED} for anonymous user on remove ${TestUtils.getUrlWithId(
        baseProductUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseProductUrl, invalidItemId),
        );

        expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it(`Should return ${HttpStatus.NOT_FOUND} for missing item on remove ${TestUtils.getUrlWithId(
        baseProductUrl,
        ':id',
    )} (DELETE)`, async () => {
        const response: Response = await ApiRequest.delete(
            app.getHttpServer(),
            TestUtils.getUrlWithId(baseProductUrl, invalidItemId),
            true,
        );

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    const createCategory = async (): Promise<string> => {
        const categoryData: ICreateCategoryCommand = { displayName: 'TestCategory' };
        const createdCategoryEntity = await categoryServiceAdapter.createCategory(categoryData);

        expect(createdCategoryEntity).toBeTruthy();
        expect(createdCategoryEntity.id).toBeTruthy();

        return createdCategoryEntity.id;
    };

    const createProduct = async (categoryId: string): Promise<IProductCommand> => {
        const productData: ICreateProductCommand = {
            categoryId,
            displayName: testProductName,
            price: 100,
        };
        const createdProductEntity = await productServiceAdapter.createProduct(productData);

        expect(createdProductEntity.serviceResultType).toEqual(ServiceResultType.Success);
        expect(createdProductEntity.data).toBeTruthy();

        return createdProductEntity.data;
    };
});
