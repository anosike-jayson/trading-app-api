import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { AuthModule } from '../auth/auth.module';
import { FXModule } from '../fx/fx.module';
import { TransactionsModule } from 'src/transaction/transaction.module';
import { WalletBalance } from './entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletBalance]), AuthModule, FXModule, TransactionsModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}