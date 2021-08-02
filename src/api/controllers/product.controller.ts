import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from '../dto/actions/create-product.dto';
import { ProductDto } from '../dto/models/product.dto';
import { ProductService } from '../../bl/services/product.service';

@ApiTags('Products')
@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('id/:id')
    @ApiOkResponse({ type: ProductDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getProducts(@Param('id') id: string): Promise<ProductDto> {
        return this.productService.getProductById(id);
    }

    @Post()
    @ApiCreatedResponse({ type: ProductDto, description: 'Created' })
    async createProduct(@Body() productDto: CreateProductDto): Promise<ProductDto> {
        return this.productService.createProduct(productDto);
    }

    @Put()
    @ApiOkResponse({ type: ProductDto, description: 'OK' })
    async updateCategory(@Body() category: ProductDto): Promise<ProductDto> {
        return await this.productService.updateProduct(category);
    }

    @Delete('id/:id')
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async softRemoveCategory(@Param('id') id: string): Promise<void> {
        await this.productService.softRemoveProduct(id);
    }

    @Delete('id/:id')
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async removeCategory(@Param('id') id: string): Promise<void> {
        await this.productService.removeProduct(id);
    }
}
