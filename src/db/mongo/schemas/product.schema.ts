import { Category } from './category.schema';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IProduct } from '../types/product.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating } from './rating.schema';

export type ProductDocument = Product & Document;

@Schema({ versionKey: false })
export class Product implements IProduct {
    _id: string;

    @Prop({ required: true, index: true })
    displayName: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
    category?: Category;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Rating' }], default: [] })
    ratings?: Rating[];

    @Prop({ default: 0, index: true })
    totalRating: number;

    @Prop({ required: true, index: true })
    price: number;

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
