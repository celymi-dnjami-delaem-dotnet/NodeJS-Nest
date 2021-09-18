import { IBaseLastRating } from './base-last-rating.type';
import { ICreateLastRating } from './create-last-rating.type';

export interface ILastRatingRepository {
    getLastRatings: (limit: number) => Promise<IBaseLastRating[]>;
    addLastRating: (createLastRating: ICreateLastRating) => Promise<void>;
    removeObsoleteRatings: () => Promise<void>;
}

export const LastRatingRepositoryName = Symbol('ILastRatingRepository');
