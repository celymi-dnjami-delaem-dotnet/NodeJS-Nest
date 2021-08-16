import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
import { CreateCategoryDto } from '../dto/create-category.dto';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @ApiOkResponse({ type: [CategoryDto], description: 'OK' })
    async getCategories(): Promise<CategoryDto[]> {
        return this.categoryService.getCategories();
    }

    @UseGuards(CategorySearchGuard)
    @Get('id/:id')
    @ApiOkResponse({ type: CategoryDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getCategoryById(
        @Param('id') id: string,
        @Query('includeProducts') includeProducts?: string,
        @Query('includeTopProducts') includeTopProducts?: string,
    ): Promise<CategoryDto> {
        return await this.categoryService.getCategoryById(id, includeProducts, includeTopProducts);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: CategoryDto, description: 'Created' })
    async createCategory(@Body() category: CreateCategoryDto): Promise<CategoryDto> {
        return await this.categoryService.createCategory(category);
    }

    @Put()
    @ApiOkResponse({ type: CategoryDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async updateCategory(@Body() category: CategoryDto): Promise<CategoryDto> {
        return await this.categoryService.updateCategory(category);
    }

    @Delete('soft-remove/id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async softRemoveCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.softRemoveCategory(id);
    }

    @Delete('id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async removeCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.removeCategory(id);
    }
}
