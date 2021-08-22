import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
import { CategoryDto } from '../dto/category.dto';
import { CategorySearchGuard } from '../guards/category-search.guard';
import { CategoryService } from '../../bl/services/category.service';
import { CollectionSearchGuard } from '../guards/collection-search.guard';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { CreateCategoryDto } from '../dto/create-category.dto';

@ApiTags(ControllerTags.Categories)
@Controller('api/categories')
export class CategoryController {
    constructor(private readonly _categoryService: CategoryService) {}

    @UseGuards(CollectionSearchGuard)
    @Get()
    @ApiImplicitQuery({ name: 'limit', required: false, type: Number })
    @ApiImplicitQuery({ name: 'offset', required: false, type: Number })
    @ApiOkResponse({ type: [CategoryDto], description: 'OK' })
    async getCategories(@Query('limit') limit?: string, @Query('offset') offset?: string): Promise<CategoryDto[]> {
        return this._categoryService.getCategories(limit, offset);
    }

    @UseGuards(CategorySearchGuard)
    @Get('id/:id')
    @ApiImplicitQuery({ name: 'includeProducts', required: false, type: Boolean })
    @ApiImplicitQuery({ name: 'includeTopProducts', required: false, type: Number })
    @ApiOkResponse({ type: CategoryDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getCategoryById(
        @Param('id') id: string,
        @Query('includeProducts') includeProducts?: string,
        @Query('includeTopProducts') includeTopProducts?: string,
    ): Promise<CategoryDto> {
        return await this._categoryService.getCategoryById(id, includeProducts, includeTopProducts);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: CategoryDto, description: 'Created' })
    async createCategory(@Body() category: CreateCategoryDto): Promise<CategoryDto> {
        return await this._categoryService.createCategory(category);
    }

    @Put()
    @ApiOkResponse({ type: CategoryDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async updateCategory(@Body() category: CategoryDto): Promise<CategoryDto> {
        return await this._categoryService.updateCategory(category);
    }

    @Delete('soft-remove/id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async softRemoveCategory(@Param('id') id: string): Promise<void> {
        await this._categoryService.softRemoveCategory(id);
    }

    @Delete('id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async removeCategory(@Param('id') id: string): Promise<void> {
        await this._categoryService.removeCategory(id);
    }
}
