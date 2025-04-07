import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private txRepo: Repository<Transaction>) {}

  async getTransactions(userId: number): Promise<Transaction[]> {
    try {
      return await this.txRepo.find({
        where: { user: { id: userId } },
        order: { timestamp: 'DESC' },
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new InternalServerErrorException('Failed to retrieve transactions');
    }
  }

  async logTransaction(
    userId: number,
    type: string,
    fromCurrency?: string,
    fromAmount?: number,
    toCurrency?: string,
    toAmount?: number,
    rate?: number,
    status: string = 'success',
  ): Promise<void> {
    try {
      const transaction = this.txRepo.create({
        user: { id: userId },
        type,
        fromCurrency,
        fromAmount,
        toCurrency,
        toAmount,
        rate,
        timestamp: new Date(),
        status,
      });
      await this.txRepo.save(transaction);
    } catch (error) {
      console.error('Error logging transaction:', error);
      throw new InternalServerErrorException('Failed to log transaction');
    }
  }
}