import { Cron } from '@nestjs/schedule';
import { IRatingServiceAdapter, RatingServiceAdapterName } from '../../db/adapter/rating-service.adapter';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LastRatingJob {
    constructor(@Inject(RatingServiceAdapterName) private readonly _ratingServiceAdapter: IRatingServiceAdapter) {}

    @Cron('0 0 * * 1')
    async handleRemoveObsoleteRatings(): Promise<void> {
        await this._ratingServiceAdapter.removeObsoleteRatings();
    }
}
