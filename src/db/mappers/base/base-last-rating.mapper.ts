import { IBaseLastRating } from '../../base-types/base-last-rating.type';
import { ICreateLastRating } from '../../base-types/create-last-rating.type';
import { ICreateLastRatingCommand } from '../../../bl/commands/create-last-rating.command';
import { ILastRatingCommand } from '../../../bl/commands/last-rating.command';
import { ILastRatingDbMapper } from '../types/last-rating-mapper.type';

export class BaseLastRatingMapper implements ILastRatingDbMapper {
    mapCreateToDbFromCommand(createLastRatingCommand: ICreateLastRatingCommand): ICreateLastRating {
        return {
            userName: createLastRatingCommand.userName,
            productName: createLastRatingCommand.productName,
            rating: createLastRatingCommand.rating,
        };
    }

    mapToCommandFromDb(lastRatingDb: IBaseLastRating): ILastRatingCommand {
        return {
            userName: lastRatingDb.userName,
            productName: lastRatingDb.productName,
            rating: lastRatingDb.rating,
            createdAt: lastRatingDb.createdAt,
            isDeleted: lastRatingDb.isDeleted,
        };
    }
}
