import { Controller, Get, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { TransactionsService } from './transaction.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(@Req() req) {
    try {
      return await this.transactionsService.getTransactions(req.user.sub);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve transactions due to an unexpected error.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}