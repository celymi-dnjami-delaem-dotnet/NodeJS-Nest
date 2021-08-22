import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IRole } from '../types/role.type';
import { User } from './user.entity';

@Entity()
export class Role implements IRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ nullable: false, unique: true })
    displayName: string;

    @ManyToMany(() => User, (user) => user.roles)
    users?: User[];

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
