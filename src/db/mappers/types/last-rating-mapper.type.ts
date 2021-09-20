import { IBaseLastRating } from '../../base-types/base-last-rating.type';
import { ICreateLastRating } from '../../base-types/create-last-rating.type';
import { ICreateLastRatingCommand } from '../../../bl/commands/create-last-rating.command';
import { ILastRatingCommand } from '../../../bl/commands/last-rating.command';

export interface ILastRatingDbMapper {
    mapToCommandFromDb: (ratingDb: IBaseLastRating) => ILastRatingCommand;
    mapCreateToDbFromCommand: (createLastRatingCommand: ICreateLastRatingCommand) => ICreateLastRating;
}

export const LastRatingDbMapperName = Symbol('ILastRatingDbMapper');
