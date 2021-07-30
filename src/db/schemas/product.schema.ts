import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';

export type ProductDocument = Product & Document;

@Schema({ versionKey: false })
export class Product {
    _id: string;

    @Prop({ required: true })
    displayName: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
    category?: Category;

    @Prop({ default: 0 })
    totalRating: number;

    @Prop({ required: true })
    price: number;

    @Prop({ default: Date.now() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
