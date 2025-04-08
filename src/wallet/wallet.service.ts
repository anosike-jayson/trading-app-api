import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FXService } from '../fx/fx.service';
import { TransactionsService } from 'src/transaction/transaction.service';
import { WalletBalance } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletBalance) private walletRepo: Repository<WalletBalance>,
    private fxService: FXService,
    private transactionsService: TransactionsService,
  ) {}

  async fundWallet(userId: number, currency: string, amount: number): Promise<{ message: string }> {
    try {
      const fundAmount = Number(amount.toFixed(2)); 
      if (isNaN(fundAmount)) {
        throw new BadRequestException('Amount must be a valid number');
      }
      return await this.walletRepo.manager.transaction(async (manager) => {
        console.log(`Funding - User: ${userId}, Currency: ${currency}, Amount: ${fundAmount}`);
        let balance = await manager.findOne(WalletBalance, {
          where: { user: { id: userId }, currency },
        });
        console.log('Before:', balance ? balance.balance : 'None');
        if (!balance) {
          balance = manager.create(WalletBalance, { user: { id: userId }, currency, balance: 0 });
          console.log('Created new balance');
        }
        balance.balance = Number(balance.balance) + fundAmount;
        console.log('After:', balance.balance);
        await manager.save(balance);
        console.log('Saved:', balance.balance);
  
        await this.transactionsService.logTransaction(userId, 'fund', undefined, undefined, currency, fundAmount);
        return { message: 'Wallet funded successfully' };
      });
    } catch (error) {
      console.error('Error funding wallet:', error);
      throw new InternalServerErrorException('Failed to fund wallet');
    }
  }
  
  async getWallet(userId: number): Promise<WalletBalance[]> {
    try {
      return await this.walletRepo.find({ where: { user: { id: userId } } }); 
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
      throw new InternalServerErrorException('Failed to retrieve wallet balances');
    }
  }

  async convertCurrency(
    userId: number,
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ): Promise<{ fromAmount: number; toAmount: number; rate: number }> {
    try {
      if (fromCurrency !== 'NGN' && toCurrency !== 'NGN') {
        throw new BadRequestException('One currency must be NGN');
      }

      const rates = await this.fxService.getCachedFXRates();
      const rate = fromCurrency === 'NGN' ? rates[toCurrency] : 1 / rates[fromCurrency];
      if (!rate) {
        throw new BadRequestException('Unsupported currency pair');
      }

      return await this.walletRepo.manager.transaction(async (manager) => {
        const fromBalance = await manager.findOne(WalletBalance, {
          where: { user: { id: userId }, currency: fromCurrency },
        });
        if (!fromBalance || fromBalance.balance < amount) {
          throw new BadRequestException('Insufficient balance');
        }

        const toAmount = fromCurrency === 'NGN' ? amount * rate : amount / rate;

        fromBalance.balance -= amount;
        await manager.save(fromBalance);

        let toBalance = await manager.findOne(WalletBalance, {
          where: { user: { id: userId }, currency: toCurrency },
        });
        if (!toBalance) {
          toBalance = manager.create(WalletBalance, { user: { id: userId }, currency: toCurrency, balance: 0 });
        }
        toBalance.balance += parseFloat(toAmount.toFixed(2));
        await manager.save(toBalance);

        await this.transactionsService.logTransaction(
          userId,
          'convert',
          fromCurrency,
          amount,
          toCurrency,
          toAmount,
          rate,
        );

        return { fromAmount: amount, toAmount, rate };
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error converting currency:', error);
      throw new InternalServerErrorException('Failed to convert currency');
    }
  }
}