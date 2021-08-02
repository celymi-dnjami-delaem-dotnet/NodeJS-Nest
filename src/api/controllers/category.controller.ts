import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryDto } from '../dto/models/category.dto';
import { CategoryService } from '../../bl/services/category.service';
import { CreateCategoryDto } from '../dto/actions/create-category.dto';

@ApiTags('Categories')
@Controller('api/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('id/:id')
    @ApiOkResponse({ type: CategoryDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
        return await this.categoryService.getCategoryById(id);
    }

    @Post()
    @ApiCreatedResponse({ type: CategoryDto, description: 'Created' })
    async createCategory(@Body() category: CreateCategoryDto): Promise<CategoryDto> {
        return await this.categoryService.createCategory(category);
    }

    @Put()
    @ApiOkResponse({ type: CategoryDto, description: 'OK' })
    async updateCategory(@Body() category: CategoryDto): Promise<CategoryDto> {
        return await this.categoryService.updateCategory(category);
    }

    @Delete('soft-remove/id/:id')
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async softRemoveCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.softRemoveCategory(id);
    }

    @Delete('id/:id')
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async removeCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.removeCategory(id);
    }
}
