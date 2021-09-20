import { BaseRatingMapper } from '../base/base-rating.mapper';
import { IRatingCommand } from '../../../bl/commands/rating.command';
import { IRatingDbMapper } from '../types/rating-mapper.type';
import { Injectable } from '@nestjs/common';
import { Rating } from '../../postgres/entities/rating.entity';

@Injectable()
export class RatingEntityMapper extends BaseRatingMapper implements IRatingDbMapper {
    mapToCommandFromDb(ratingDb: Rating): IRatingCommand {
        const baseRating = super.mapToCommandFromDb(ratingDb);

        return {
            ...baseRating,
            id: ratingDb.id,
        };
    }

    mapToDbFromCommand(ratingCommand: IRatingCommand): Rating {
        const baseRating = super.mapToDbFromCommand(ratingCommand);

        return {
            ...baseRating,
            id: ratingCommand.id,
        };
    }
}
