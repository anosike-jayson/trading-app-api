import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { FXModule } from './fx/fx.module';
import { databaseConfig } from './configs/database.config';
import { TransactionsModule } from './transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig), 
    AuthModule,
    WalletModule,
    FXModule,
    TransactionsModule,
  ],
})
export class AppModule {}