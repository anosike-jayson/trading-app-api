import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string; // 'fund', 'convert', 'trade'

    @Column({ nullable: true })
    fromCurrency?: string;

    @Column('decimal', { precision: 18, scale: 2, nullable: true })
    fromAmount?: number;

    @Column({ nullable: true })
    toCurrency?: string;

    @Column('decimal', { precision: 18, scale: 2, nullable: true })
    toAmount?: number;

    @Column('decimal', { precision: 18, scale: 6, nullable: true })
    rate?: number;

    @Column()
    status: string; // 'success', 'failed'

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    timestamp: Date;

}