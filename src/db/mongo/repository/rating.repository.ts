import { IBaseRating } from '../../base-types/base-rating.type';
import { ICreateRatingDb } from '../../base-types/create-rating.type';
import { IRatingRepository } from '../../base-types/rating-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Rating, RatingDocument } from '../schemas/rating.schema';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User, UserDocument } from '../schemas/user.schema';
import {
    missingProductEntityExceptionMessage,
    missingRatingEntityExceptionMessage,
    missingUserEntityExceptionMessage,
} from '../../constants';

@Injectable()
export class RatingMongooseRepository implements IRatingRepository {
    constructor(
        @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
        @InjectModel(Product.name) private readonly _productModel: Model<ProductDocument>,
        @InjectModel(Rating.name) private readonly _ratingModel: Model<RatingDocument>,
    ) {}

    async getRatings(limit: number, offset: number): Promise<Rating[]> {
        return this._ratingModel.find().skip(offset).limit(limit);
    }

    async getTopLastRatings(limit: number): Promise<IBaseRating[]> {
        return this._ratingModel.find().sort({ createdAt: -1 }).limit(limit);
    }

    async getRatingById(id: string): Promise<ServiceResult<Rating>> {
        const foundRating = await this._ratingModel.findOne({ _id: id });

        if (!foundRating) {
            return new ServiceResult<Rating>(ServiceResultType.NotFound, null, missingRatingEntityExceptionMessage);
        }

        return new ServiceResult<Rating>(ServiceResultType.Success, foundRating);
    }

    async setRating(createRatingDb: ICreateRatingDb): Promise<ServiceResult<IBaseRating>> {
        const existingUser = await this._userModel.findOne({ _id: createRatingDb.userId }).exec();
        if (!existingUser) {
            return new ServiceResult<Rating>(ServiceResultType.Success, null, missingUserEntityExceptionMessage);
        }

        const existingProduct = await this._productModel
            .findOne({ _id: createRatingDb.productId })
            .populate('ratings')
            .exec();
        if (!existingProduct) {
            return new ServiceResult<Rating>(ServiceResultType.Success, null, missingProductEntityExceptionMessage);
        }

        const existingRating = await this._ratingModel.findOne({ user: existingUser, product: existingProduct }).exec();
        let createdRating: Rating;
        if (existingRating) {
            await this._ratingModel.updateOne({ _id: existingRating._id }, { $set: { rating: createRatingDb.rating } });

            createdRating = await this._ratingModel.findById(existingRating._id);
        } else {
            const newRating = new Rating();
            newRating.product = existingProduct;
            newRating.user = existingUser;
            newRating.rating = createRatingDb.rating;

            createdRating = await new this._ratingModel(newRating).save();
        }

        await this._productModel.updateOne(
            { _id: existingProduct._id },
            {
                $push: {
                    ratings: createdRating._id,
                },
                $set: {
                    totalRating: existingProduct.totalRating + createRatingDb.rating,
                },
            },
        );

        return new ServiceResult<Rating>(ServiceResultType.Success, createdRating);
    }

    async softRemoveRating(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this._ratingModel.updateOne({ _id: id }, { $set: { isDeleted: true } });

        if (!softRemoveResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingRatingEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeRating(id: string): Promise<ServiceResult> {
        const softRemoveResult = await this._ratingModel.deleteOne({ _id: id });

        if (!softRemoveResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success, null, missingRatingEntityExceptionMessage);
    }

    async removeAllRatings(): Promise<ServiceResult> {
        const removeResult = await this._ratingModel.deleteMany().exec();

        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound);
        }

        return new ServiceResult(ServiceResultType.Success);
    }
}
