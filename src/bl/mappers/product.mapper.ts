import { CreateProductDto } from '../../api/dto/create-product.dto';
import { ICreateProductCommand } from '../commands/create-product.command';
import { IProductCommand } from '../commands/product.command';
import { ProductDto } from '../../api/dto/product.dto';

export class ProductMapper {
    static mapCreateToCommandFromDto(createProductDto: CreateProductDto): ICreateProductCommand {
        return {
            categoryId: createProductDto.categoryId,
            displayName: createProductDto.displayName,
            price: createProductDto.price,
        };
    }

    static mapToCommandFromDto(productDto: ProductDto): IProductCommand {
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

    static mapToDtoFromCommand(productCommand: IProductCommand): ProductDto {
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
