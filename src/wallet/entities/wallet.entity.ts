import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class WalletBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}