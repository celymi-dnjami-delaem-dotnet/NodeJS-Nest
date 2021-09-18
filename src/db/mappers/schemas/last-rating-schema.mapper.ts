import { BaseLastRatingMapper } from '../base/base-last-rating.mapper';
import { ILastRatingCommand } from '../../../bl/commands/last-rating.command';
import { ILastRatingDbMapper } from '../types/last-rating-mapper.type';
import { LastRating } from '../../mongo/schemas/last-rating.schema';

export class LastRatingSchemaMapper extends BaseLastRatingMapper implements ILastRatingDbMapper {
    mapToCommandFromDb(lastRatingDb: LastRating): ILastRatingCommand {
        const baseLastRating = super.mapToCommandFromDb(lastRatingDb);

        return {
            ...baseLastRating,
            id: lastRatingDb._id,
        };
    }
}
