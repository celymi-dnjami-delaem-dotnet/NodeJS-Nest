import { IBaseRating } from '../../base-types/base-rating.type';
import { ICreateRatingDb } from '../../base-types/create-rating.type';
import { IRatingRepository } from '../../base-types/rating-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from '../schemas/rating.schema';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';

@Injectable()
export class RatingMongooseRepository implements IRatingRepository {
    constructor(@InjectModel(Rating.name) private readonly _ratingModel: Model<RatingDocument>) {}

    getRatings(limit: number, offset: number): Promise<Rating[]> {
        return Promise.resolve([]);
    }

    getRatingById(id: string): Promise<ServiceResult<Rating>> {
        return Promise.resolve(undefined);
    }

    setRating(createRatingDb: ICreateRatingDb): Promise<ServiceResult<IBaseRating>> {
        return Promise.resolve(undefined);
    }

    softRemoveRating(id: string): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }

    removeRating(id: string): Promise<ServiceResult> {
        return Promise.resolve(undefined);
    }
}
