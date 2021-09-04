import { Document, Schema as MongooseSchema } from 'mongoose';
import { IRating } from '../types/rating.type';
import { Product } from './product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

export type RatingDocument = Rating & Document;

@Schema({ versionKey: false })
export class Rating implements IRating {
    _id: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user?: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
    product?: Product;

    @Prop({ required: true })
    rating: number;

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
