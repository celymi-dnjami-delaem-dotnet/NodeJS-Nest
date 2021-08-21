import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../types/user.type';

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ nullable: false, unique: true })
    userName: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Index()
    @Column({ nullable: false })
    password?: string;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
