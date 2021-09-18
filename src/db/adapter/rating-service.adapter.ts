import { ICollectionSearchCommand } from '../../bl/commands/collection-search.command';
import { ICreateLastRatingCommand } from '../../bl/commands/create-last-rating.command';
import { ICreateRatingCommand } from '../../bl/commands/create-rating.command';
import { ILastRatingDbMapper, LastRatingDbMapperName } from '../mappers/types/last-rating-mapper.type';
import { ILastRatingRepository, LastRatingRepositoryName } from '../base-types/last-rating-repository.type';
import { IRatingCommand } from '../../bl/commands/rating.command';
import { IRatingDbMapper, RatingDbMapperName } from '../mappers/types/rating-mapper.type';
import { IRatingRepository, RatingRepositoryName } from '../base-types/rating-repository.type';
import { Inject } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IRatingServiceAdapter {
    getRatings: (collectionSearchCommand: ICollectionSearchCommand) => Promise<IRatingCommand[]>;
    getTopLastRatings: (limit: number) => Promise<IRatingCommand[]>;
    getRatingById: (id: string) => Promise<ServiceResult<IRatingCommand>>;
    setRating: (createRatingCommand: ICreateRatingCommand) => Promise<ServiceResult<IRatingCommand>>;
    createLastRating: (createLastRatingCommand: ICreateLastRatingCommand) => Promise<void>;
    softRemoveRating: (id: string) => Promise<ServiceResult>;
    removeRating: (id: string) => Promise<ServiceResult>;
    removeAllRatings: () => Promise<ServiceResult>;
    removeObsoleteRatings: () => Promise<void>;
}

export const RatingServiceAdapterName = Symbol('IRatingServiceAdapter');

export class RatingServiceAdapter implements IRatingServiceAdapter {
    constructor(
        @Inject(RatingRepositoryName) private readonly _ratingRepository: IRatingRepository,
        @Inject(LastRatingRepositoryName) private readonly _lastRatingRepository: ILastRatingRepository,
        @Inject(RatingDbMapperName) private readonly _ratingMapper: IRatingDbMapper,
        @Inject(LastRatingDbMapperName) private readonly _lastRatingMapper: ILastRatingDbMapper,
    ) {}

    async getRatings({ limit, offset }: ICollectionSearchCommand): Promise<IRatingCommand[]> {
        const ratings = await this._ratingRepository.getRatings(limit, offset);

        return ratings.map((x) => this._ratingMapper.mapToCommandFromDb(x));
    }

    async getTopLastRatings(limit: number): Promise<IRatingCommand[]> {
        const ratings = await this._lastRatingRepository.getLastRatings(limit);

        return ratings.map((x) => this._ratingMapper.mapToCommandFromDb(x));
    }

    async getRatingById(id: string): Promise<ServiceResult<IRatingCommand>> {
        const { serviceResultType, exceptionMessage, data } = await this._ratingRepository.getRatingById(id);

        return new ServiceResult<IRatingCommand>(
            serviceResultType,
            data && this._ratingMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async setRating(createRatingCommand: ICreateRatingCommand): Promise<ServiceResult<IRatingCommand>> {
        const createRatingDb = this._ratingMapper.mapCreateToDbFromCommand(createRatingCommand);

        const { serviceResultType, exceptionMessage, data } = await this._ratingRepository.setRating(createRatingDb);

        return new ServiceResult<IRatingCommand>(
            serviceResultType,
            data && this._ratingMapper.mapToCommandFromDb(data),
            exceptionMessage,
        );
    }

    async createLastRating(createLastRatingCommand: ICreateLastRatingCommand): Promise<void> {
        const createLastRatingDb = this._lastRatingMapper.mapCreateToDbFromCommand(createLastRatingCommand);

        await this._lastRatingRepository.addLastRating(createLastRatingDb);
    }

    async softRemoveRating(id: string): Promise<ServiceResult> {
        return this._ratingRepository.softRemoveRating(id);
    }

    async removeRating(id: string): Promise<ServiceResult> {
        return this._ratingRepository.removeRating(id);
    }

    async removeAllRatings(): Promise<ServiceResult> {
        return this._ratingRepository.removeAllRatings();
    }

    async removeObsoleteRatings(): Promise<void> {
        await this._lastRatingRepository.removeObsoleteRatings();
    }
}
