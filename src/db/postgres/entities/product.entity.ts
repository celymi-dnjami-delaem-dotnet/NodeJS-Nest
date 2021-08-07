import { Category } from './category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IProduct } from '../types/product.type';

@Entity()
export class Product implements IProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    displayName: string;

    @Column({ nullable: false })
    price: number;

    @Column({ nullable: false, default: 0 })
    totalRating: number;

    @ManyToOne(() => Category, (category) => category.products)
    category?: Category;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
