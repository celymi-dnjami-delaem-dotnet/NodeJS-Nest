import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ICategory } from '../types/category.type';
import { Product } from './product.entity';

@Entity()
export class Category implements ICategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ nullable: false })
    displayName: string;

    @OneToMany(() => Product, (product) => product.category)
    products?: Product[];

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
