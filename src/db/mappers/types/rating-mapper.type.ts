import { IBaseRating } from '../../base-types/base-rating.type';
import { ICreateRatingCommand } from '../../../bl/commands/create-rating.command';
import { ICreateRatingDb } from '../../base-types/create-rating.type';
import { IRatingCommand } from '../../../bl/commands/rating.command';

export interface IRatingDbMapper {
    mapToCommandFromDb: (ratingDb: IBaseRating) => IRatingCommand;
    mapToDbFromCommand: (ratingCommand: IRatingCommand) => IBaseRating;
    mapCreateToDbFromCommand: (createRatingCommand: ICreateRatingCommand) => ICreateRatingDb;
}

export const RatingDbMapperName = Symbol('IRatingDbMapper');
