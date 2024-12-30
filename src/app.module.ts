import { Module } from '@nestjs/common';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { HttpModule } from '@nestjs/axios';
import { DeviceStatusService } from './vonage-api/network-api/device-status.service';
import { DeviceLocationService } from './vonage-api/network-api/device-location.service';
import { NumberVerificationService } from './vonage-api/network-api/number-verification.service';
import { SimSwapService } from './vonage-api/network-api/sim-swap.service';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './common/auth.service';
import { OneTimePasswordService } from './common/one-time-password.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WhatsAppService } from './vonage-api/communication-api/whatsapp.service';
import { SmsService } from './vonage-api/communication-api/sms.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    DeviceStatusService,
    DeviceLocationService,
    NumberVerificationService,
    SimSwapService,
    AuthService,
    OneTimePasswordService,
    WhatsAppService,
    SmsService
  ],
})
export class AppModule {}
