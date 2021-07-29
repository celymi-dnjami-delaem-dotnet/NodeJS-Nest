import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ProductService } from '../../bl/services/product.service';
import { ProductDto } from '../dto/models/product.dto';

@Controller('api/product')
export class ProductsController {
    constructor(private readonly productService: ProductService) {}

    @Get('id/:id')
    async getProducts(@Param('id') id: string): Promise<ProductDto> {
        return this.productService.getProductById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createProduct(@Body() productDto: ProductDto): Promise<ProductDto> {
        return this.productService.createProduct(productDto);
    }

    @Put()
    async updateCategory(@Body() category: ProductDto): Promise<ProductDto> {
        return await this.productService.updateProduct(category);
    }

    @Delete('soft-remove/id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softRemoveCategory(@Param('id') id: string): Promise<void> {
        await this.productService.softRemoveProduct(id);
    }

    @Delete('id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeCategory(@Param('id') id: string): Promise<void> {
        await this.productService.removeProduct(id);
    }
}
