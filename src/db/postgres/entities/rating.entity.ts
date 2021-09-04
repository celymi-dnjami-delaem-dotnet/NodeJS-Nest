import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IRating } from '../types/rating.type';
import { Product } from './product.entity';
import { User } from './user.entity';

export class Rating implements IRating {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (product) => product.ratings)
    product: Product;

    @ManyToOne(() => User, (user) => user.ratings)
    user: User;

    @Column({ nullable: false })
    rating: number;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
