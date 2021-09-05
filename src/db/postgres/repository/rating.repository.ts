import { IBaseRating } from '../../base-types/base-rating.type';
import { ICreateRatingDb } from '../../base-types/create-rating.type';
import { IRatingRepository } from '../../base-types/rating-repository.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Rating } from '../entities/rating.entity';
import { Repository } from 'typeorm';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User } from '../entities/user.entity';
import {
    missingProductEntityExceptionMessage,
    missingRatingEntityExceptionMessage,
    missingUserEntityExceptionMessage,
} from '../../constants';

export class RatingTypeOrmRepository implements IRatingRepository {
    constructor(
        @InjectRepository(Product) private readonly _productRepository: Repository<Product>,
        @InjectRepository(User) private readonly _userRepository: Repository<User>,
        @InjectRepository(Rating) private readonly _ratingRepository: Repository<Rating>,
    ) {}

    async getRatings(limit: number, offset: number): Promise<IBaseRating[]> {
        return this._ratingRepository.find({ skip: offset, take: limit });
    }

    async getRatingById(id: string): Promise<ServiceResult<IBaseRating>> {
        const foundRating = await this._ratingRepository.findOne({ id });
        if (!foundRating) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success, null, missingRatingEntityExceptionMessage);
    }

    async setRating(createRatingDb: ICreateRatingDb): Promise<ServiceResult<IBaseRating>> {
        const existingUser = await this._userRepository.findOne({ id: createRatingDb.userId });
        if (!existingUser) {
            return new ServiceResult<Rating>(ServiceResultType.Success, null, missingUserEntityExceptionMessage);
        }

        const existingProduct = await this._productRepository.findOne({ id: createRatingDb.productId });
        if (!existingProduct) {
            return new ServiceResult<Rating>(ServiceResultType.Success, null, missingProductEntityExceptionMessage);
        }

        const existingRating = await this._ratingRepository.findOne({ user: existingUser, product: existingProduct });
        let createRating: Rating;
        if (existingRating) {
            await this._ratingRepository.update({ id: existingRating.id }, { rating: createRatingDb.rating });

            createRating = await this._ratingRepository.findOne({ id: existingRating.id });
        } else {
            const newRating = new Rating();
            newRating.user = existingUser;
            newRating.product = existingProduct;
            newRating.rating = createRatingDb.rating;

            createRating = await this._productRepository.save(newRating);
        }

        return new ServiceResult<Rating>(ServiceResultType.Success, createRating);
    }

    async softRemoveRating(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this._ratingRepository.update({ id }, { isDeleted: true });
        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success, null, missingRatingEntityExceptionMessage);
    }

    async removeRating(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this._ratingRepository.delete({ id });
        if (!softRemoveResult.affected) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success, null, missingRatingEntityExceptionMessage);
    }
}
