import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from '../dto/in/create-product.dto';
import { IProductService, ProductServiceName } from '../../bl/services/product.service';
import { ProductDto } from '../dto/out/product.dto';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
    constructor(@Inject(ProductServiceName) private readonly productService: IProductService) {}

    @Get()
    @ApiOkResponse({ type: [ProductDto], description: 'OK' })
    async getCategories(): Promise<ProductDto[]> {
        return this.productService.getProducts();
    }

    @Get('id/:id')
    @ApiOkResponse({ type: ProductDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getProducts(@Param('id') id: string): Promise<ProductDto> {
        return this.productService.getProductById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: ProductDto, description: 'Created' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async createProduct(@Body() productDto: CreateProductDto): Promise<ProductDto> {
        return this.productService.createProduct(productDto);
    }

    @Put()
    @ApiOkResponse({ type: ProductDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async updateCategory(@Body() category: ProductDto): Promise<ProductDto> {
        return await this.productService.updateProduct(category);
    }

    @Delete('soft-remove/id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async softRemoveCategory(@Param('id') id: string): Promise<void> {
        await this.productService.softRemoveProduct(id);
    }

    @Delete('id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async removeCategory(@Param('id') id: string): Promise<void> {
        await this.productService.removeProduct(id);
    }
}
