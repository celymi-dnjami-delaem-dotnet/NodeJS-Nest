import { IBaseRating } from '../../base-types/base-rating.type';
import { ICreateRatingCommand } from '../../../bl/commands/create-rating.command';
import { ICreateRatingDb } from '../../base-types/create-rating.type';
import { IRatingCommand } from '../../../bl/commands/rating.command';
import { IRatingDbMapper } from '../types/rating-mapper.type';

export abstract class BaseRatingMapper implements IRatingDbMapper {
    mapCreateToDbFromCommand(createRoleCommand: ICreateRatingCommand): ICreateRatingDb {
        return {
            userId: createRoleCommand.userId,
            productId: createRoleCommand.productId,
            rating: createRoleCommand.rating,
        };
    }

    mapToCommandFromDb(ratingDb: IBaseRating): IRatingCommand {
        return {
            rating: ratingDb.rating,
            createdAt: ratingDb.createdAt,
            isDeleted: ratingDb.isDeleted,
        };
    }

    mapToDbFromCommand(ratingCommand: IRatingCommand): IBaseRating {
        return {
            rating: ratingCommand.rating,
            createdAt: ratingCommand.createdAt,
            isDeleted: ratingCommand.isDeleted,
        };
    }
}
