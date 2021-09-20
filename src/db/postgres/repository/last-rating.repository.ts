import { ICreateLastRating } from '../../base-types/create-last-rating.type';
import { ILastRating } from '../types/last-rating.type';
import { ILastRatingRepository } from '../../base-types/last-rating-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LastRating } from '../entities/last-rating.entity';
import { Repository } from 'typeorm';
import { getMinDateForLastRating } from '../../constants';

@Injectable()
export class LastRatingTypeOrmRepository implements ILastRatingRepository {
    constructor(@InjectRepository(LastRating) private readonly _lastRatingRepository: Repository<LastRating>) {}

    async getLastRatings(limit: number): Promise<ILastRating[]> {
        return this._lastRatingRepository.find({ order: { createdAt: -1 }, take: limit });
    }

    async addLastRating({ userName, productName, rating }: ICreateLastRating): Promise<void> {
        const lastRating = new LastRating();
        lastRating.userName = userName;
        lastRating.productName = productName;
        lastRating.rating = rating;

        await this._lastRatingRepository.create(lastRating);
    }

    async removeObsoleteRatings(): Promise<void> {
        const currentDate = new Date();

        await this._lastRatingRepository
            .createQueryBuilder()
            .delete()
            .from(LastRating)
            .where('createdAt < :date', { date: getMinDateForLastRating(currentDate) })
            .execute();
    }
}
