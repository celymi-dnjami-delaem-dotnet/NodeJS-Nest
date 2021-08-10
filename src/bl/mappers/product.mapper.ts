import { CreateProductCommand } from '../commands/in/create-product.command';
import { CreateProductDto } from '../../api/dto/in/create-product.dto';
import { Injectable } from '@nestjs/common';
import { ProductCommand } from '../commands/out/product.command';
import { ProductDto } from '../../api/dto/out/product.dto';

export interface IProductBlMapper {
    mapToDtoFromCommand: (productCommand: ProductCommand) => ProductDto;
    mapToCommandFromDto: (productDto: ProductDto) => ProductCommand;
    mapCreateToCommandFromDto: (createProductDto: CreateProductDto) => CreateProductCommand;
}

export const ProductBlMapperName = Symbol('IProductBlMapper');

@Injectable()
export class ProductMapper implements IProductBlMapper {
    mapCreateToCommandFromDto(createProductDto: CreateProductDto): CreateProductCommand {
        return {
            categoryId: createProductDto.categoryId,
            displayName: createProductDto.displayName,
            price: createProductDto.price,
        };
    }

    mapToCommandFromDto(productDto: ProductDto): ProductCommand {
        return {
            id: productDto.id,
            categoryId: productDto.categoryId,
            displayName: productDto.displayName,
            price: productDto.price,
            totalRating: productDto.totalRating,
            createdAt: productDto.createdAt,
            isDeleted: productDto.isDeleted,
        };
    }

    mapToDtoFromCommand(productCommand: ProductCommand): ProductDto {
        return {
            id: productCommand.id,
            categoryId: productCommand.categoryId,
            displayName: productCommand.displayName,
            price: productCommand.price,
            totalRating: productCommand.totalRating,
            createdAt: productCommand.createdAt,
            isDeleted: productCommand.isDeleted,
        };
    }
}
