import { ProductController } from '../../api/controllers/product.controller';
import { ProductService } from '../../bll/services/product.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProductController', () => {
    let appController: ProductController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [ProductService],
        }).compile();

        appController = app.get<ProductController>(ProductController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getProducts()).toBe('Hello World!');
        });
    });
});
