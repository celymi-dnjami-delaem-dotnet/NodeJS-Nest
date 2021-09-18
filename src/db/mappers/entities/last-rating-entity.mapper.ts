import { BaseLastRatingMapper } from '../base/base-last-rating.mapper';
import { ILastRatingCommand } from '../../../bl/commands/last-rating.command';
import { ILastRatingDbMapper } from '../types/last-rating-mapper.type';
import { LastRating } from '../../postgres/entities/last-rating.entity';

export class LastRatingEntityMapper extends BaseLastRatingMapper implements ILastRatingDbMapper {
    mapToCommandFromDb(lastRatingDb: LastRating): ILastRatingCommand {
        const baseLastRating = super.mapToCommandFromDb(lastRatingDb);

        return {
            ...baseLastRating,
            id: lastRatingDb.id,
        };
    }
}
