import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IUserToken } from '../types/user-token.type';
import { User } from './user.entity';

@Entity()
export class UserToken implements IUserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @ManyToOne(() => User, (x) => x.tokens)
    user: User;

    @Index()
    @Column({ nullable: false })
    accessToken: string;

    @Index()
    @Column({ nullable: false })
    refreshToken: string;

    @Column({ default: new Date() })
    updatedAt: Date;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
