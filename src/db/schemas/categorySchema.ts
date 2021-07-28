import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from './productSchema';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false })
export class Category {
    _id: string;

    @Prop({ required: true })
    displayName: string;

    @Prop({ type: [MongooseSchema.Types.ObjectId], default: [], ref: 'Product' })
    products?: Product[];

    @Prop({ default: Date.now() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
