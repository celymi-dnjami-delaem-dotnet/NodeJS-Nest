import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ skipVersioning: true })
export class Category {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: string;

    @Prop({ required: true })
    displayName: string;

    @Prop({ default: Date.now() })
    createdAt: Date;
}

export const CategorySchemaName = 'Category';

export const CategorySchema = SchemaFactory.createForClass(Category);
