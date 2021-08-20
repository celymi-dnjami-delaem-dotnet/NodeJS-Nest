import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductDto } from '../dto/product.dto';
import { ProductSearchGuard } from '../guards/product-search.guard';
import { ProductService } from '../../bl/services/product.service';

@ApiTags(ControllerTags.Products)
@Controller('api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(ProductSearchGuard)
    @Get()
    @ApiImplicitQuery({ name: 'displayName', required: false, type: String })
    @ApiImplicitQuery({ name: 'minRating', required: false, type: Number })
    @ApiImplicitQuery({ name: 'sortBy', required: false, type: String })
    @ApiImplicitQuery({ name: 'price', required: false, type: String })
    @ApiImplicitQuery({ name: 'limit', required: false, type: Number })
    @ApiImplicitQuery({ name: 'offset', required: false, type: Number })
    @ApiOkResponse({ type: [ProductDto], description: 'OK' })
    async getCategories(
        @Query('displayName') displayName?: string,
        @Query('minRating') minRating?: string,
        @Query('sortBy') sortBy?: string,
        @Query('price') price?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ): Promise<ProductDto[]> {
        return this.productService.getProducts(displayName, minRating, sortBy, price, limit, offset);
    }

    @Get('id/:id')
    @ApiOkResponse({ type: ProductDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getProducts(@Param('id') id: string): Promise<ProductDto> {
        return this.productService.getProductById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: CreateProductDto, description: 'Created' })
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
