import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { FXController } from './fx.controller';
import { FXService } from './fx.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 300, 
      max: 100, 
    }),
  ],
  controllers: [FXController],
  providers: [FXService],
  exports: [FXService], 
})
export class FXModule {}