import { IsString, IsNumber, Min } from 'class-validator';

export class FundDto {
  @IsString()
  currency: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

export class ConvertDto {
    @IsString()
    fromCurrency: string;
  
    @IsString()
    toCurrency: string;
  
    @IsNumber()
    @Min(0)
    amount: number;
  }

  export class TradeDto {
    @IsString()
    fromCurrency: string;
  
    @IsString()
    toCurrency: string;
  
    @IsNumber()
    @Min(0)
    amount: number;
  }

  