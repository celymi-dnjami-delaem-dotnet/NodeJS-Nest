import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ProductService } from '../../bl/services/product.service';
import { ProductDto } from '../dto/models/product.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('api/product')
export class ProductsController {
    constructor(private readonly appService: ProductService) {}

    @Get('id/:id')
    async getProducts(@Param('id') id: string): Promise<ProductDto> {
        return this.appService.getProductById(id);
    }

    @Post()
    @HttpCode(StatusCodes.CREATED)
    async createProduct(@Body() productDto: ProductDto): Promise<ProductDto> {
        return this.appService.createProduct(productDto);
    }
}
