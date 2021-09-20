import { ICreateLastRating } from '../../base-types/create-last-rating.type';
import { ILastRatingRepository } from '../../base-types/last-rating-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { LastRating, LastRatingDocument } from '../schemas/last-rating.schema';
import { Model } from 'mongoose';

@Injectable()
export class LastRatingMongooseRepository implements ILastRatingRepository {
    constructor(@InjectModel(LastRating.name) private readonly _lastRatingModel: Model<LastRatingDocument>) {}

    async getLastRatings(limit: number): Promise<LastRating[]> {
        return this._lastRatingModel.find().sort({ createdAt: -1 }).limit(limit);
    }

    async addLastRating({ userName, productName, rating }: ICreateLastRating): Promise<void> {
        const lastRating = new this._lastRatingModel();
        lastRating.userName = userName;
        lastRating.productName = productName;
        lastRating.rating = rating;

        await lastRating.save();
    }

    async removeObsoleteRatings(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
