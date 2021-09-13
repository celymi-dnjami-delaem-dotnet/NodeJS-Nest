import { Document, Schema as MongooseSchema } from 'mongoose';
import { IUserToken } from '../types/user-token.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

export type UserTokenDocument = UserToken & Document;

@Schema({ versionKey: false })
export class UserToken implements IUserToken {
    _id: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user?: User;

    @Prop({ required: true })
    accessToken: string;

    @Prop({ required: true })
    refreshToken: string;

    @Prop({ default: new Date() })
    updatedAt: Date;

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
