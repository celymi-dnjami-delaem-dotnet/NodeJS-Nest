import { ICollectionSearchCommand } from '../../bl/commands/collection-search.command';
import { ICreateRatingCommand } from '../../bl/commands/create-rating.command';
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
    softRemoveRating: (id: string) => Promise<ServiceResult>;
    removeRating: (id: string) => Promise<ServiceResult>;
    removeAllRatings: () => Promise<ServiceResult>;
}

export const RatingServiceAdapterName = Symbol('IRatingServiceAdapter');

export class RatingServiceAdapter implements IRatingServiceAdapter {
    constructor(
        @Inject(RatingRepositoryName) private readonly _ratingRepository: IRatingRepository,
        @Inject(RatingDbMapperName) private readonly _ratingMapper: IRatingDbMapper,
    ) {}

    async getRatings({ limit, offset }: ICollectionSearchCommand): Promise<IRatingCommand[]> {
        const ratings = await this._ratingRepository.getRatings(limit, offset);

        return ratings.map((x) => this._ratingMapper.mapToCommandFromDb(x));
    }

    async getTopLastRatings(limit: number): Promise<IRatingCommand[]> {
        const ratings = await this._ratingRepository.getTopLastRatings(limit);

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

    async softRemoveRating(id: string): Promise<ServiceResult> {
        return this._ratingRepository.softRemoveRating(id);
    }

    async removeRating(id: string): Promise<ServiceResult> {
        return this._ratingRepository.removeRating(id);
    }

    async removeAllRatings(): Promise<ServiceResult> {
        return this._ratingRepository.removeAllRatings();
    }
}
