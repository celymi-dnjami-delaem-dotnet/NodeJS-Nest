import { IBaseRating } from './base-rating.type';
import { ICreateRatingDb } from './create-rating.type';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IRatingRepository {
    getRatings: (limit: number, offset: number) => Promise<IBaseRating[]>;
    getRatingById: (id: string) => Promise<ServiceResult<IBaseRating>>;
    setRating: (createRatingDb: ICreateRatingDb) => Promise<ServiceResult<IBaseRating>>;
    softRemoveRating: (id: string) => Promise<ServiceResult>;
    removeRating: (id: string) => Promise<ServiceResult>;
    removeAllRatings: () => Promise<ServiceResult>;
}

export const RatingRepositoryName = Symbol('IRatingRepository');
