import { CreateRatingDto } from '../../api/dto/create-rating.dto';
import { ICreateRatingCommand } from '../commands/create-rating.command';
import { IRatingCommand } from '../commands/rating.command';
import { RatingDto } from '../../api/dto/rating.dto';

export class RatingMapper {
    static mapCreateToCommandFromDto(createRatingDto: CreateRatingDto): ICreateRatingCommand {
        return {
            userId: createRatingDto.userId,
            productId: createRatingDto.productId,
            rating: createRatingDto.rating,
        };
    }

    static mapToDtoFromCommand(ratingCommand: IRatingCommand): RatingDto {
        return {
            id: ratingCommand.id,
            userId: ratingCommand.userId,
            productId: ratingCommand.productId,
            rating: ratingCommand.rating,
            isDeleted: ratingCommand.isDeleted,
            createdAt: ratingCommand.createdAt,
        };
    }
}
