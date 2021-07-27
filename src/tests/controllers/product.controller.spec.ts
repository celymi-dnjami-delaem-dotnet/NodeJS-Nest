import { ProductsController } from '../../api/controllers/products.controller';
import { ProductService } from '../../bll/services/product.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProductController', () => {
    let appController: ProductsController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [ProductService],
        }).compile();

        appController = app.get<ProductsController>(ProductsController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getProducts()).toBe('Hello World!');
        });
    });
});
