import { BaseRatingMapper } from '../base/base-rating.mapper';
import { IRatingCommand } from '../../../bl/commands/rating.command';
import { IRatingDbMapper } from '../types/rating-mapper.type';
import { Rating } from '../../mongo/schemas/rating.schema';

export class RatingSchemaMapper extends BaseRatingMapper implements IRatingDbMapper {
    mapToCommandFromDb(ratingDb: Rating): IRatingCommand {
        const baseRating = super.mapToCommandFromDb(ratingDb);

        return {
            ...baseRating,
            id: ratingDb._id,
            userId: ratingDb.user && ratingDb.user._id,
            productId: ratingDb.product && ratingDb.product._id,
        };
    }

    mapToDbFromCommand(ratingCommand: IRatingCommand): Rating {
        const baseRating = super.mapToDbFromCommand(ratingCommand);

        return {
            ...baseRating,
            _id: ratingCommand.id,
        };
    }
}
