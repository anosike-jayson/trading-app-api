import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
@Unique(['user', 'currency']) 
export class WalletBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  currency: string;

  @Column('decimal', { precision: 18, scale: 2 })
  balance: number;
}