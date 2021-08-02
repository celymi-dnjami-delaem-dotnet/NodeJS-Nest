import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from '../dto/actions/create-product.dto';
import { ProductDto } from '../dto/models/product.dto';
import { ProductService } from '../../bl/services/product.service';

@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('id/:id')
    async getProducts(@Param('id') id: string): Promise<ProductDto> {
        return this.productService.getProductById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createProduct(@Body() productDto: CreateProductDto): Promise<ProductDto> {
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
