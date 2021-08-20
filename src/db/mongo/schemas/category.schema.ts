import { Document, Schema as MongooseSchema } from 'mongoose';
import { ICategory } from '../types/category.type';
import { Product } from './product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false })
export class Category implements ICategory {
    _id: string;

    @Prop({ required: true, index: true })
    displayName: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }], default: [] })
    products?: Product[];

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
