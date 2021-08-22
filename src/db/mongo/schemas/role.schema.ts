import { Document } from 'mongoose';
import { IRole } from '../types/role.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoleDocument = Role & Document;

@Schema({ versionKey: false })
export class Role implements IRole {
    _id: string;

    @Prop({ unique: true, required: true, index: true })
    displayName: string;

    @Prop({ required: new Date() })
    createdAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
