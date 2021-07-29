import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from '../../bl/services/category.service';
import { CategoryDto } from '../dto/models/category.dto';
import { CreateCategoryDto } from '../dto/actions/create-category.dto';

@Controller('api/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('id/:id')
    async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
        return await this.categoryService.getCategoryById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCategory(@Body() category: CreateCategoryDto): Promise<CategoryDto> {
        return await this.categoryService.createCategory(category);
    }

    @Put()
    async updateCategory(@Body() category: CategoryDto): Promise<CategoryDto> {
        return await this.categoryService.updateCategory(category);
    }

    @Delete('soft-remove/id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softRemoveCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.softRemoveCategory(id);
    }

    @Delete('id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.removeCategory(id);
    }
}
