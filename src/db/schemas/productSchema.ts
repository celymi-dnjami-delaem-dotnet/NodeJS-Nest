import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './categorySchema';

export type ProductDocument = Product & Document;

@Schema({ skipVersioning: true })
export class Product {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: string;

    @Prop({ required: true })
    displayName: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
    category: Category;

    @Prop({ required: true })
    totalRating: number;

    @Prop({ required: true })
    price: number;

    @Prop({ default: Date.now() })
    createdAt: Date;
}

export const ProductSchemaName = 'Product';

export const ProductSchema = SchemaFactory.createForClass(Product);
