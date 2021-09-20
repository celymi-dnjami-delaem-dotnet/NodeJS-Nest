import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ILastRating } from '../types/last-rating.type';

@Entity()
export class LastRating implements ILastRating {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    productName: string;

    @Column({ nullable: false })
    userName: string;

    @Column({ nullable: false })
    rating: number;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
