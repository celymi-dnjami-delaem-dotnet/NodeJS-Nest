import { ICreateUserDb } from '../../base-types/create-user.type';
import { IUserRepository } from '../../base-types/user-repository.type';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServiceResult } from '../../../bl/result-wrappers/service-result';
import { ServiceResultType } from '../../../bl/result-wrappers/service-result-type';
import { User, UserDocument } from '../schemas/user.schema';
import { missingUserEntityExceptionMessage } from '../../constants';

@Injectable()
export class UserMongooseRepository implements IUserRepository {
    constructor(@InjectModel(User.name) private readonly _userModel: Model<UserDocument>) {}

    async getUsers(limit: number, offset: number): Promise<User[]> {
        return this._userModel.find({ take: limit, skip: offset }).exec();
    }

    async getUserById(id: string): Promise<ServiceResult<User>> {
        const foundUser = await this.findUserById(id);
        if (!foundUser) {
            return new ServiceResult<User>(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult<User>(ServiceResultType.Success, foundUser);
    }

    async createUser(user: ICreateUserDb): Promise<ServiceResult<User>> {
        const userSchema = new this._userModel(user);
        const createdUser = await userSchema.save();

        return new ServiceResult<User>(ServiceResultType.Success, createdUser);
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
            return new ServiceResult<User>(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        const updatedUser = await this.findUserById(user._id);

        return new ServiceResult<User>(ServiceResultType.Success, updatedUser);
    }

    async softRemoveUser(id: string): Promise<ServiceResult> {
        const removeResult = await this._userModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
        if (!removeResult.nModified) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    async removeUser(id: string): Promise<ServiceResult> {
        const removeResult = await this._userModel.deleteOne({ _id: id }).exec();
        if (!removeResult.deletedCount) {
            return new ServiceResult(ServiceResultType.NotFound, null, missingUserEntityExceptionMessage);
        }

        return new ServiceResult(ServiceResultType.Success);
    }

    private findUserById(id: string): Promise<User> {
        return this._userModel.findOne({ _id: id }).exec();
    }
}
