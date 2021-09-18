import { ICreateLastRatingCommand } from '../commands/create-last-rating.command';
import { ILastRatingCommand } from '../commands/last-rating.command';
import { IRatingCommand } from '../commands/rating.command';
import { LastRatingDto } from '../../api/dto/last-rating.dto';

export class LastRatingMapper {
    static mapCreateToCommandFromRatingCommand(ratingCommand: IRatingCommand): ICreateLastRatingCommand {
        return {
            userName: ratingCommand.userId,
            productName: ratingCommand.productId,
            rating: ratingCommand.rating,
        };
    }

    static mapToDtoFromCommand(lastRatingCommand: ILastRatingCommand): LastRatingDto {
        return {
            id: lastRatingCommand.id,
            userName: lastRatingCommand.userName,
            productName: lastRatingCommand.productName,
            createdAt: lastRatingCommand.createdAt,
            isDeleted: lastRatingCommand.isDeleted,
        };
    }
}
