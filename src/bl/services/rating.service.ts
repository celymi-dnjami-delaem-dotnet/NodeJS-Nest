import { CreateRatingDto } from '../../api/dto/create-rating.dto';
import { IRatingCommand } from '../commands/rating.command';
import { IRatingServiceAdapter, RatingServiceAdapterName } from '../../db/adapter/rating-service.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { RatingDto } from '../../api/dto/rating.dto';
import { RatingGateway } from '../../api/gateways/rating.gateway';
import { RatingMapper } from '../mappers/rating.mapper';
import { ServiceResult } from '../result-wrappers/service-result';
import { ServiceResultType } from '../result-wrappers/service-result-type';
import { UserFriendlyException } from '../exceptions/user-friendly.exception';
import { UserUtils } from '../utils/user.utils';
import { Utils } from '../utils';

@Injectable()
export class RatingService {
    private static readonly notPartOfDbItemExceptionMessage: string = 'User is not part of this entity';
    private static readonly totalRatingsAmount: number = 10;

    constructor(
        @Inject(RatingServiceAdapterName) private readonly _ratingServiceAdapter: IRatingServiceAdapter,
        private readonly _ratingsGateway: RatingGateway,
    ) {}

    async getRatings(limit: string, offset: string): Promise<RatingDto[]> {
        const ratings = await this._ratingServiceAdapter.getRatings(Utils.getCollectionSearchParameters(limit, offset));

        return ratings.map(RatingMapper.mapToDtoFromCommand);
    }

    async getRatingById(ratingId: string, userId: string, userRoles: string[]): Promise<RatingDto> {
        const foundRating = await this.findRating(ratingId, userId, userRoles);

        return RatingMapper.mapToDtoFromCommand(foundRating);
    }

    async setRating(createRatingDto: CreateRatingDto): Promise<RatingDto> {
        const { serviceResultType, exceptionMessage, data } = await this._ratingServiceAdapter.setRating(
            RatingMapper.mapCreateToCommandFromDto(createRatingDto),
        );

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        await this.emitLastRatingsEvent();

        return RatingMapper.mapToDtoFromCommand(data);
    }

    async softRemoveRating(ratingId: string, userId: string, userRoles: string[]): Promise<void> {
        await this.handleUserRemovement(ratingId, userId, userRoles, (args) =>
            this._ratingServiceAdapter.softRemoveRating(args),
        );
    }

    async removeRating(ratingId: string, userId: string, userRoles: string[]): Promise<void> {
        await this.handleUserRemovement(ratingId, userId, userRoles, (args) =>
            this._ratingServiceAdapter.removeRating(args),
        );
    }

    private async findRating(id: string, userId: string, userRoles: string[]): Promise<IRatingCommand> {
        const { serviceResultType, exceptionMessage, data } = await this._ratingServiceAdapter.getRatingById(id);

        Utils.validateServiceResultType(serviceResultType, exceptionMessage);

        if (UserUtils.isBuyerOrAdmin(userRoles) && data.userId !== userId) {
            throw new UserFriendlyException(
                ServiceResultType.InvalidData,
                RatingService.notPartOfDbItemExceptionMessage,
            );
        }

        return data;
    }

    private async handleUserRemovement(
        ratingId: string,
        userId: string,
        userRoles: string[],
        callback: (id: string) => Promise<ServiceResult>,
    ): Promise<void> {
        await this.findRating(ratingId, userId, userRoles);

        const { serviceResultType } = await callback(ratingId);

        Utils.validateServiceResultType(serviceResultType);

        await this.emitLastRatingsEvent();
    }

    private async emitLastRatingsEvent(): Promise<void> {
        const lastRatingsCommand = await this._ratingServiceAdapter.getTopLastRatings(RatingService.totalRatingsAmount);
        const lastRatingsDto = lastRatingsCommand.map(RatingMapper.mapToDtoFromCommand);

        await this._ratingsGateway.sendLastRatings(lastRatingsDto);
    }
}
