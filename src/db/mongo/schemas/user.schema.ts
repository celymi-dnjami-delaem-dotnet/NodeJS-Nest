import { Document, Schema as MongooseSchema } from 'mongoose';
import { IRating } from '../types/rating.type';
import { IUser } from '../types/user.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './role.schema';
import { UserToken } from './user-token.schema';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User implements IUser {
    _id: string;

    @Prop({ unique: true, required: true, index: true })
    userName: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }], default: [] })
    roles?: Role[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'UserToken' }], default: [] })
    tokens?: UserToken[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Rating' }], default: [] })
    ratings?: IRating[];

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    password?: string;

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
