import { ICreateUserDb } from '../../base-types/create-user.type';
import { IUserRepository } from '../../base-types/user-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserMongooseRepository implements IUserRepository {
    constructor(@InjectModel(User.name) private readonly _userModel: Model<UserDocument>) {}

    async getUsers(): Promise<User[]> {
        return this._userModel.find().exec();
    }

    async getUserById(id: string): Promise<ServiceResult<User>> {
        const foundUser = await this._userModel.findOne({ _id: id }).exec();
        if (!foundUser) {
            return new ServiceResult<User>(ServiceResultType.NotFound);
        }

        return new ServiceResult<User>(ServiceResultType.Success, foundUser);
    }

    async createUser(user: ICreateUserDb): Promise<User> {
        const userSchema = new this._userModel(user);

        return await userSchema.save();
    }

    async updateUser(user: User): Promise<ServiceResult<User>> {
        const updateResult = await this._userModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
        );
        if (!updateResult.nModified) {
            return new ServiceResult<User>(ServiceResultType.NotFound);
        }

        const updatedUser = await this._userModel.findOne({ _id: user._id });

        return new ServiceResult<User>(ServiceResultType.Success, updatedUser);
    }

    async softRemoveUser(id: string): Promise<ServiceResult> {
        const removeResult = await this._userModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
        if (removeResult.nModified) {
            return new ServiceResult(ServiceResultType.Success);
        }

        return new ServiceResult(ServiceResultType.NotFound);
    }

    async removeUser(id: string): Promise<ServiceResult> {
        const removeResult = await this._userModel.deleteOne({ _id: id }).exec();
        if (removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.Success);
        }

        return new ServiceResult(ServiceResultType.NotFound);
    }
}
