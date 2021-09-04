import { IBaseRating } from '../../base-types/base-rating.type';
import { ICreateRatingDb } from '../../base-types/create-rating.type';
import { IRatingRepository } from '../../base-types/rating-repository.type';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';

export class RatingTypeOrmRepository implements IRatingRepository {
    async getRatings(limit: number, offset: number): Promise<IBaseRating[]> {
        return Promise.resolve([]);
    }

    async getRatingById(id: string): Promise<ServiceResult<IBaseRating>> {
        return Promise.resolve(undefined);
    }

    async setRating(createRatingDb: ICreateRatingDb): Promise<ServiceResult<IBaseRating>> {
        return Promise.resolve(undefined);
    }

    async softRemoveRating(id: string): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }

    async removeRating(id: string): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }
}
