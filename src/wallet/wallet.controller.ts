import { Controller, Get, Post, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { FundDto, ConvertDto, TradeDto } from './dto/wallet.dto';
import { WalletService } from './wallet.service';
@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Req() req) {
    try {
      return await this.walletService.getWallet(req.user.sub);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve wallet balances due to an unexpected error.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('fund')
  async fundWallet(@Req() req, @Body() fundDto: FundDto) {
    try {
      return await this.walletService.fundWallet(req.user.sub, fundDto.currency, fundDto.amount);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fund wallet due to an unexpected error.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('convert')
  async convert(@Req() req, @Body() convertDto: ConvertDto) {
    try {
      return await this.walletService.convertCurrency(
        req.user.sub,
        convertDto.fromCurrency,
        convertDto.toCurrency,
        convertDto.amount,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to convert currency due to an unexpected error.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('trade')
  async trade(@Req() req, @Body() tradeDto: TradeDto) {
    try {
      return await this.walletService.convertCurrency(
        req.user.sub,
        tradeDto.fromCurrency,
        tradeDto.toCurrency,
        tradeDto.amount,
      ); // For simplicity, same as convert
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to trade currency due to an unexpected error.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}