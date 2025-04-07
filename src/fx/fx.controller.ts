import { Controller, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FXService } from './fx.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';

@Controller('fx')
@UseGuards(JwtAuthGuard)
export class FXController {
  constructor(private readonly fxService: FXService) {}

  @Get('rates')
  async getRates() {
    try {
      return await this.fxService.getCachedFXRates();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch FX rates due to an unexpected error.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}