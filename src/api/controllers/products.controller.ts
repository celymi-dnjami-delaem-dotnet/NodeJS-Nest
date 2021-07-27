import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../../bl/services/product.service';

@Controller('api/products')
export class ProductsController {
    constructor(private readonly appService: ProductService) {}

    @Get()
    getProducts(): any {
        return this.appService.getProducts();
    }
}
