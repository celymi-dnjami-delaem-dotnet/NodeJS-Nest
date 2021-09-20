import { Document } from 'mongoose';
import { ILastRating } from '../types/last-rating.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LastRatingDocument = LastRating & Document;

@Schema({ versionKey: false })
export class LastRating implements ILastRating {
    _id: string;

    @Prop({ required: true })
    rating: number;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    productName: string;

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const LastRatingSchema = SchemaFactory.createForClass(LastRating);
