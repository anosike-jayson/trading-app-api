import { Inject, Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; 

@Injectable()
export class FXService {
  private readonly apiUrl = process.env.FX_API_KEY
    ? `https://v6.exchangerate-api.com/v6/${process.env.FX_API_KEY}/latest/NGN`
    : 'https://api.exchangerate-api.com/v4/latest/NGN'; 

  constructor(private httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async fetchFXRates(): Promise<{ [key: string]: number }> {
    try {
      const response = await firstValueFrom(this.httpService.get(this.apiUrl));
      const rates = response.data.rates;
      if (!rates) {
        throw new ServiceUnavailableException('Invalid response from FX API');
      }
      return rates;
    } catch (error) {
      console.error('Error fetching FX rates:', error.message);
      const cachedRates = await this.cacheManager.get('fx_rates_NGN');
      if (cachedRates) {
        return cachedRates as { [key: string]: number };
      }
      throw new ServiceUnavailableException('FX rates unavailable. Please try again later.');
    }
  }

  async getCachedFXRates(): Promise<{ [key: string]: number }> {
    try {
      const cached = await this.cacheManager.get('fx_rates_NGN');
      if (cached) {
        return cached as { [key: string]: number };
      }

      const rates = await this.fetchFXRates();
      await this.cacheManager.set('fx_rates_NGN', rates, 300); 
      return rates;
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }
      console.error('Error retrieving cached FX rates:', error);
      throw new InternalServerErrorException('Failed to retrieve FX rates');
    }
  }
}