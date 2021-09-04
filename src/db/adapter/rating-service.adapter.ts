import { ICollectionSearchCommand } from '../../bl/commands/collection-search.command';
import { ICreateRatingCommand } from '../../bl/commands/create-rating.command';
import { IRatingCommand } from '../../bl/commands/rating.command';
import { IRatingDbMapper, RatingDbMapperName } from '../mappers/types/rating-mapper.type';
import { IRatingRepository, RatingRepositoryName } from '../base-types/rating-repository.type';
import { Inject } from '@nestjs/common';
import { ServiceResult } from '../../bl/result-wrappers/service-result';

export interface IRatingServiceAdapter {
    getRatings: (collectionSearchCommand: ICollectionSearchCommand) => Promise<IRatingCommand[]>;
    getRatingById: (id: string) => Promise<ServiceResult<IRatingCommand>>;
    setRating: (createRatingCommand: ICreateRatingCommand) => Promise<ServiceResult<IRatingCommand>>;
    softRemoveRating: (id: string) => Promise<ServiceResult>;
    removeRating: (id: string) => Promise<ServiceResult>;
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

    async getRatingById(id: string): Promise<ServiceResult<IRatingCommand>> {
        const foundRating = await this._ratingRepository.getRatingById(id);
        foundRating.data = foundRating.data && this._ratingMapper.mapToCommandFromDb(foundRating.data);

        return foundRating;
    }

    async setRating(createRatingCommand: ICreateRatingCommand): Promise<ServiceResult<IRatingCommand>> {
        const createRatingDb = this._ratingMapper.mapCreateToDbFromCommand(createRatingCommand);

        const dbResult = await this._ratingRepository.setRating(createRatingDb);
        dbResult.data = dbResult.data && this._ratingMapper.mapToCommandFromDb(dbResult.data);

        return dbResult;
    }

    async softRemoveRating(id: string): Promise<ServiceResult> {
        return this._ratingRepository.softRemoveRating(id);
    }

    async removeRating(id: string): Promise<ServiceResult> {
        return this._ratingRepository.removeRating(id);
    }
}
