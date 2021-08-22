import { Document, Schema as MongooseSchema } from 'mongoose';
import { IRole } from '../types/role.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

export type RoleDocument = Role & Document;

@Schema({ versionKey: false })
export class Role implements IRole {
    _id: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
    users?: User[];

    @Prop({ unique: true, required: true, index: true })
    displayName: string;

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
